'use strict';

import mongoose from 'mongoose';

let StudentSchema = mongoose.Schema({
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

module.exports = exports = mongoose.model('Student', StudentSchema);
