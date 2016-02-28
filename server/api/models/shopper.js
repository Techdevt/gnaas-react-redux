'use strict';

import mongoose from 'mongoose';

let ShopperSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    firstName: String,
    lastName: String,
    avatarUrl: [String],
    homePhone: String,
    phone: String,
    gender: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: ''
    }
});

ShopperSchema.methods.addOrder = () => {

};

ShopperSchema.methods.addWish = () => {

};

module.exports = exports = mongoose.model('Shopper', ShopperSchema);
