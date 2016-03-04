import Category from '../../models/category';
import Product from '../../models/product';
import { fileHelper } from '../image.js';

export default class Products {
	getProducts() {

	}

	searchProduct() {
		
	}
	
	addProduct(product) {
		return new Promise((resolve, reject) => {
			Category.find({catName: product.category})
				.then((category) => {
					category.resolveBrand(product.brand)
							.then((brand) => {
								//process product images
								//current implementation of image processing does square images, we'll change that later
								fileHelper
									.execute(product.images, [80, 200, 350], product.merchantId)
									.then((images) => {
										const fieldsToSet = {
											brand: brand,
											productName: product.productName,
											price: product.price,
											quantity: product.quantity,
											owner: product.merchantId,
											category: category,
											color: product.color,
											images: images
										};
										Product.create(fieldsToSet).then((item) => {
											resolve(item);
										}, err => reject(err));
									}, err => reject(err));
							}, err => reject(err));
				}, err => reject(err));
		});
	}

	removeProduct(id) {

	}

	editProduct(fields) {

	}	
}