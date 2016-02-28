'use strict';

import mongoose from 'mongoose';

let CommentSchema = mongoose.Schema({
   commentID: { type: mongoose.Schema.Types.ObjectID },
   productID: { type: mongoose.Schema.Types.ObjectID, ref: 'Product' }
   comment: String,
   dateCreated: { type: Date, default: Date.Now }
});

CommentSchema.methods.add = () => {

};

CommentSchema.methods.delete = () => {

};

module.exports = exports = mongoose.model('Comment', CommentSchema);
