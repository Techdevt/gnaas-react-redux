'use strict';

import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

let PostSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { select: 'username email roles' }
    },
    title: String,
    shorturl: String,
    abstract: String,
    content: String,
    date: { type: Date, default: Date.now },
    published: Boolean,
    tags: String,
    headerImage: [String],
    readNext: String
});
//add comments

PostSchema.plugin(autopopulate);

module.exports = exports = mongoose.model('Post', PostSchema);
