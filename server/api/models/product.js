import mongoose from 'mongoose';

let ProductSchema = mongoose.Schema({
	productId: mongoose.Schema.Types.ObjectID,
	productTitle: { type: String, maxLength: 50},
	price: Number, //double
	quantity: Number
});

ProductSchema.methods.addProduct = () => {

};

ProductSchema.methods.updateProductDetails = () => {

};

ProductSchema.methods.uploadProductImage = () => {

};

ProductSchema.methods.deleteProduct = () => {

};

ProductSchema.methods.updateStockDetails = () => {

};

ProductSchema.methods.checkStock = () => {

};


exports = module.exports = mongoose.model('Product', ProductSchema);