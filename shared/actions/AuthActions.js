import request from 'axios';
const BACKEND_URL = 'http://127.0.0.1:3000';

export function createUser(user) {
	return {
		type: 'CREATE_USER',
		promise: (client) => client.post('/user', {
	      data: user
	    })
	}; 
}

export function initiatePasswordReset(email) {
	return {
		type: 'INITIATE_PASSWORD_RESET',
		promise: (client) => client.post('/resetpass', {
	      data: email
	    })
	};
}

export function deleteImage() {
	return {
		type: 'DELETE_IMAGE',
		promise: (client) => client.post('/resetImage')
	};
}

export function resetPassword(credentials) {
	return {
		type: 'RESET_PASSWORD',
		promise: (client) => client.post(`/resetpass/${credentials.id}/${credentials.token}`)
	};
}

export function authenticateUser(credentials) {
	return {
		type: 'AUTH_USER',
		promise: (client) => client.post('/auth', {
	      data: credentials
	    })
	};
}

export function logoutUser() {
	return function(dispatch) {
		logoutBackend().then(
			(data) => dispatch(logoutSuccess(data))
		);
	}
}

export function logoutSuccess(data) {
	window.localStorage.removeItem('token');
	
	return {
		type: 'LOGOUT_SUCCESS',
		res: data
	};
}

export function logoutBackend() {
	return request.post(`${BACKEND_URL}/logout`);
}

export function editUser(fields) {
	return {
		type: 'EDIT_USER',
		promise: (client) => client.put('/user', {
	      data: fields
	    })
	};
}

export function deleteUser(credentials) {
	return {
		type: 'DELETE_USER',
		promise: (client) => client.delete('/user', {
	      data: credentials
	    })
	};
}

export function cleanAuthMessage() {
	return {
		type: 'CLEAN_AUTH_MESSAGE'
	};
}