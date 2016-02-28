'use strict';

import mongoose from 'mongoose';

let DelegateSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    firstName: String,
    lastName: String,
    company: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Merchant'
        }
    },
    roles: [{
        name: String,
        permit: Boolean
    }],
    avatarUrl: [String],
    phone: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: ''
    }
});

DelegateSchema.index({
    user: 1
});

module.exports = exports = mongoose.model('Delegate', DelegateSchema);
// user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         autopopulate: true
//     },