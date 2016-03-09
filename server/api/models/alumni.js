'use strict';

import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

let AlumniSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    affiliatedInstitution: String,
    residingCountry: String,
    avatarUrl: [String],
    firstName: String,
    lastName: String,
    homePhone: String,
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

AlumniSchema.plugin(autopopulate);

AlumniSchema.index({
    user: 1
});

module.exports = exports = mongoose.model('Alumni', AlumniSchema);
