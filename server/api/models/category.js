'use strict';

import mongoose from 'mongoose';
import Product from './product';

let CategorySchema = mongoose.Schema({
   category: String,
   description: String,
   productList: [Product]
});

module.exports = exports = mongoose.model('Category', CategorySchema);
