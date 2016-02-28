'use strict';

import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

let MerchantSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companyName: String,
    avatarUrl: [String],
    phone: String,
    delegates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: ''
    }
});

MerchantSchema.plugin(autopopulate);

MerchantSchema.index({
    user: 1
});

module.exports = exports = mongoose.model('Merchant', MerchantSchema);
