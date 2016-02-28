'use strict';

import Product from './product';
import mongoose from 'mongoose';

let WishlistSchema = mongoose.Schema({
    wishId: mongoose.Schema.Types.ObjectID,
    wishTitle: String,
    productList: [Product]
});

WishlistSchema.methods.addWish = () => {

};

WishlistSchema.methods.deleteWish = () => {

};

module.exports = exports = mongoose.model('Wishlist', WishlistSchema);
