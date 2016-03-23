import lwip from 'lwip';
import fs from 'fs';
import _ from 'lodash';
import async from 'async';
import FileUtils from './file';
import _path from 'path';

export default class ImageProcessor {
    execute = (images, dimension) => {
        if (images.length) {
            let promises = [];

            _.each(images, function(image, index) {
                promises.push(function(image) {
                    const type = image.mimetype.split('/')[1];
                    const path = image.path;
                    const name = image.filename;
                    const imageRef = image;

                    return new Promise(function(resolve, reject) {
                        try {
                            fs.readFile(image.path, function(err, buffer) {
                                lwip.open(buffer, type, function(err, image) {
                                    if (err) reject(err);

                                    if (!image) reject('Image processing failed');
                                    var size = Math.min(image.width(), image.height());
                                    if (Array.isArray(dimension)) {
                                        const arrayToReturn = [];
                                        _.each(dimension, function(dim) {
                                            arrayToReturn.push(function(callback) {
                                                image.clone(function(err, newImage) {
                                                    if (err) reject(err);
                                                    newImage
                                                    .batch()
                                                    .crop(size, size)
                                                    .scale((dim / size) || 0.5)
                                                    .writeFile(_path.join(appRoot, `/server/uploads/${name}×${dim}.${type}`), function(err) {
                                                        if (err) return callback(err);

                                                        return callback(null, {
                                                            path: _path.join(appRoot, `/server/uploads/${name}×${dim}.${type}`),
                                                            name: `${name}×${dim}.${type}`
                                                        });
                                                    });
                                                });
                                            });
                                        });

                                        async.series(arrayToReturn, function(err, results) {
                                            if (err) return reject(err);
                                            const FileHandler = new FileUtils();

                                            FileHandler.delete(imageRef.path).then(function(res) {
                                            	resolve(results);
                                            }, function(err) {
                                            	reject(err);
                                            });
                                        });
                                    } else {
                                        image.batch()
                                            .crop(size, size)
                                            .scale((dimension / size) || 0.5)
                                            .writeFile(path, function(err) {
                                                if (err) reject(err);
                                                resolve({
                                                    path: path,
                                                    name: name
                                                });
                                            });
                                    }
                                });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                }(image));
            });

            return new Promise(function(resolve, reject) {
                Promise.all(promises).then(function(results) {
                    resolve(results);
                }, function(err) {
                    reject(err);
                });
            });
        }
    };
}