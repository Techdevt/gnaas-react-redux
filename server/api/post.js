import { fileHelper } from './utils/helpers';
import { markdown } from 'markdown';
import toMarkdown from 'to-markdown';

import { invokeCallback, invokeCallbackM, takeAll, mergeObj, toPromise } from 'lib/util';
import csp from 'js-csp';
import t, { map, filter, toObj } from 'transducers.js';
import { currentDate } from 'lib/date';
import async from 'async';

import Post from './models/post';

let postFields = [
    'shorturl',
    'title',
    'user',
    'abstract',
    'content',
    'date',
    'published',
    'tags',
    'headerImage',
    'readNext'
];

// db representation -> JSON type
function _normalizePost(post) {
    post = toObj(post);
    if (typeof post.tags === 'string') {
        post.tags = post.tags === '' ? [] : post.tags.split(',');
    }
    if (post.date) {
        post.date = parseInt(post.date);
    }
    return post;
}

// JSON type -> db representation
function _denormalizePost(post) {
    // Only use the whitelisted fields
    post = toObj(postFields, t.compose(
        t.map(x => post[x] !== undefined ? [x, post[x]] : null),
        t.filter(x => x)
    ));


    if (post.tags) {
        post.tags = filter(map(post.tags.split(','), x => x.trim().replace(/ /g, '-')),
            x => x.length).join(',');
    }
    if (post.date) {
        post.date = post.date.toString();
    }

    return post;
}

function _resolveImageRefs(images, text) {
    let tree = markdown.parse(text),
        imageIndex = 0;
    (function find_image_refs(jsonml) {
        if (Array.isArray(jsonml)) {
            if (jsonml[0] === 'img') {

                jsonml[1].href = images[imageIndex];
                imageIndex++;
                return jsonml;
            }

            jsonml.map((node) => {
                find_image_refs(node);
            });
        }
    })(tree);

    //returns html
    return markdown.renderJsonML(markdown.toHTMLTree(tree));
}

function _resolveHeaderImage(userId, props = {}) {
    return new Promise((resolve, reject) => {
        if (!Object.hasOwnProperty.call(props, 'headerImage')) resolve(props);

        //header image unlike attached post images in markup can undergo proper image manipulations, do this later
        fileHelper(props.headerImage, [500], userId)
            .then((res) => {
                resolve(Object.assign(props, { headerImage: res }));
            }, err => reject('header image processing failed'));
    });
}

function _resolveAttachments(images, userId, props = {}) {
    return new Promise((resolve, reject) => {
        if (!images.length) resolve(props);
        fileHelper(images, [500], userId)
            .then((res) => {
                //move images to posts folder
                props.content = toMarkdown(_resolveImageRefs(res, props.content));
                resolve(props);
            }, err => {
                reject(err);
            });
    });
}

function _createPost(props = {}) {
    Post.create(props, function(err, post) {
        if (err) csp.Throw(new Error(err));
        return post;
    });
}

export function queryDrafts(query = {}) {
    //return published:false
    return new Promise((resolve, reject) => {
        Post.find({ published: false, ...query }, function(err, drafts) {
            if (err) reject(err);
            resolve(map(drafts, x => _normalizePost(x.toJSON())));
        });
    });
}

export function queryPosts(query = {}) {
    //return published true
    return new Promise((resolve, reject) => {
        Post.find({ published: true, ...query }, function(err, drafts) {
            if (err) reject(err);
            resolve(map(drafts, x => _normalizePost(x.toJSON())));
        });
    });
}

export function getPost(query) {
    //@changethis
    //getpost with shorturl
    return new Promise((resolve, reject) => {
        queryPosts(query).then((results) => {
            resolve(results);
        }, err => reject(err));
    });
}

export function getPosts(query) {
    return new Promise((resolve, reject) => {
        queryPosts(query).then((results) => {
            resolve(results);
        }, err => reject(err));
    });
}

export function updatePost(shorturl, props) {
    props = _denormalizePost(props);
    delete props.shorturl;
    //@changethis
}

export function deletePost(shorturl) {
    return;
}

export function createPost(images, userId, props = {}) {
    return new Promise((resolve, reject) => {
        props = _denormalizePost(mergeObj({
            date: currentDate(),
            tags: '',
            published: false,
            author: userId
        }, props));

        if (props.shorturl === 'new') {
            return reject('the url `new` is reserved');
        }

        Post.find({ shorturl: props.shorturl }, function(err, posts) {
            if (err) reject(err);
            if (posts.length) {
                return reject('post with similar title already exists..be unique');
            }
            _resolveHeaderImage(userId, props)
                .then((incHImg) => {
                    _resolveAttachments(images, userId, incHImg)
                        .then((doneContent) => {
                            resolve(_createPost(doneContent));
                        }, err => reject(err));
                }, err => reject(err));
        });
    });
}