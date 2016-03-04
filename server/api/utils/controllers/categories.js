import Category from '../../models/category';

export default class Categories {
	get() {
		return new Promise((resolve, reject) => {
			Category.find({})
				.select('catName catDescription dateCreated')
				.exec(function(err, categories) {
					if(err) reject(err);
					resolve(categories);
				});
		});
	}

	add(category) {
		return new Promise((resolve, reject) => {
			Category
			.find({catName: category.catName})
			.then(function(res) {
				if(res.length) return reject('Category already exists');

				Category.create(category, function(err, created) {
					if(err) reject(err);
					resolve({
						message: 'Category successfully created',
						category: created
					});
				});
			}, function(err) {
				reject(err);
			});
		});
	}

	delete(id) {
		return new Promise((resolve, reject) => {
			Category.findById(id)
				.then(function(category) {
					if(!category) reject('category not found');

					category.remove(function(err, removed) {
						if(err) reject(err);
						resolve({
							message: 'Successfully deleted category',
							id: id
						});
					});
				}, (err) => reject(err));
		});
	}

	edit(id, fields) {
		return new Promise((resolve, reject) => {
			Category.findByIdAndUpdate(id, fields, {new: true}, function(err, updated) {
				if(err) reject(err);
				if(!updated) reject('update failed');
				resolve({
					message: 'Category edited successfully',
					category: updated
				});
			});
		});
	}
}