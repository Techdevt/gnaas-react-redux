export function createPost(post) {
	return {
		type: 'CREATE_POST',
		promise: (client) => client.post('/post', {
	      data: post
	    })
	};
}

export function editPost() {

}

export function deletePost() {

}

export function resetMessages() {
	return {
		type: 'RESET_MESSAGES'
	};
}