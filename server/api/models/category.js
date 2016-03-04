'use strict';

import mongoose from 'mongoose';
import Product from './product';
import Brand from './brand';

let CategorySchema = mongoose.Schema({
    catName: String,
    catDescription: String,
    dateCreated: { type: Date, default: Date.now },
    brands: [Brand],
    productList: [Product]
});

CategorySchema.methods.resolveBrand = function(brandName) {
	return new Promise((resolve, reject) => {
		return this.BrandExists(brandName).then(resolve, addBrand(brandName));
	});
};

CategorySchema.methods.BrandExists = function(brandName) {
	return new Promise((resolve, reject) => {
		const found = this.brands.findIndex((item) => {
			return item.name === brandName;
		});

		if(found !== -1) resolve(this.brands[found]);
		reject(false);
	});
};

CategorySchema.methods.addBrand = function(brandName) {
	return new Promise((resolve, reject) => {
		this.brands.create({name: brandName})
				.then((brand) => {
					resolve(brand);
				}, err => reject(err));
	});
};

module.exports = exports = mongoose.model('Category', CategorySchema);
