'use strict';

import mongoose from 'mongoose';
import Product from './product';

let OrderSchema = mongoose.Schema({
	orderID: mongoose.Schema.Types.ObjectID,
	orderDate: {type: Date, default: Date.Now },
	totalAmount: Number, //Double
	productList: [Product]
});

OrderSchema.methods.addOrder = () => {

};

OrderSchema.methods.getQuantity = () => {

};

OrderSchema.methods.getProduct = () => {

};

OrderSchema.methods.updateOrder = () => {

};

OrderSchema.methods.getSubTotal = () => {

};

OrderSchema.methods.getTotal = () => {

};

module.exports = exports = mongoose.model('Order', OrderSchema);