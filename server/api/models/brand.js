'use strict';

import mongoose from 'mongoose';

let BrandSchema = mongoose.Schema({
   name: String,
   dateAdded: { type: Date, default: Date.now }
});

module.exports = exports = mongoose.model('Brand', BrandSchema);
