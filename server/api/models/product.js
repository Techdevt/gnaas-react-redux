import mongoose from 'mongoose';

let ProductSchema = mongoose.Schema({
	productName: { type: String, maxLength: 50},
	price: Number, //double
	quantity: Number,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' },
	category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
	brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
	color: String,
	images: [String]
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