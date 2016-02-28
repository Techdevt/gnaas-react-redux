'use strict';

import mongoose from 'mongoose';

let AttributeSchema = mongoose.Schema({
   material: String,
   oriPrice: Number, //Double
   salePrice: Number, //Double
   color: String,
   brand: String,
   madeIn: String
});

module.exports = exports = mongoose.model('Attribute', AttributeSchema);
