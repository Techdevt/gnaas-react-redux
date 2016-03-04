export function createCategory(category) {
	return {
		type: 'CREATE_CATEGORY',
		promise: (client) => client.post('/category', {
	      data: category
	    })
	}; 
}

export function editCategory(fields) {
	return {
		type: 'EDIT_CATEGORY',
		promise: (client) => client.put('/category', {
			data: fields
		})
	};
}

export function deleteCategory(id) {
	return {
		type: 'DELETE_CATEGORY',
		promise: (client) => client.delete(`/category/${id}`)
	};
}

export function getCategories() {
	return {
		type: 'GET_CATEGORIES',
		promise: (client) => client.get('/category')
	};
}

export function clearActions() {
	return {
		type: 'CLEAN_CATEGORY_ACTIONS'
	};
}