import Immutable from 'immutable';

const defaultState = Immutable.Map({
	isLoaded: false,
	actionResult: '',
	actionWaiting: false,
	actionSuccess: false,
	data: []
});

export default function CategoryReducer(state = defaultState, action) {
	switch(action.type) {
		case 'GET_CATEGORIES':
			return state.merge({
				isLoaded: true,
				data: action.res.data
			});
		case 'CREATE_CATEGORY_REQUEST':
			return state.merge({
				actionWaiting: true
			});
		case 'CREATE_CATEGORY':
			return state.withMutations((state) => {
				state.update('data', arr => {
						return arr.concat(action.res.data.category)
					})
					 .merge({
					 	actionWaiting: false,
					 	actionResult: action.res.data.message
					 });
			});
		case 'CREATE_CATEGORY_FAILURE':
			console.log(action.error);
			return state.merge({
				actionWaiting: false,
				actionResult: action.error.data
			});
		case 'EDIT_CATEGORIES_REQUEST':
            return state.merge({
                actionWaiting: true
            });
        case 'EDIT_CATEGORY':
	        return state.withMutations((state) => {
	            state
	                .update('data', arr => {
	                    const index = arr.findIndex((item) => {
	                        return item.get('_id') === action.res.data.category._id;
	                    });
	                    return arr.set(index, Immutable.fromJS(action.res.data.category));
	                })
	                .merge({
	                    actionResult: 'category edit successfull',
	                    actionWaiting: false,
	                    actionSuccess: true
	                })
	            });
        case 'EDIT_CATEGORY_FAILURE':
            return state.merge({
                actionResult: action.error.data,
                actionWaiting: false,
                actionSuccess: false
            });
        case 'DELETE_CATEGORY_REQUEST':
        	return state.merge({
                actionWaiting: true
            });
        case 'DELETE_CATEGORY':
        	return state.withMutations(state => {
        		state.update('data', arr => {
        			const index = arr.findIndex((item) => {
	        			return item.get('_id') === action.res.data.id;
	        		});
	        		return arr.delete(index);
        		})
        		.merge({
        			actionWaiting: action.res.data.message, 
        			actionWaiting: false,
        			actionSuccess: true
        		});
        	});
        case 'DELETE_CATEGORY_FAILURE':
        	console.log(action.error);
        	return state.merge({
                actionResult: action.error.data,
                actionWaiting: false,
                actionSuccess: false
            });
        case 'CLEAN_CATEGORY_ACTIONS':
        	return state.merge({
        		actionResult: '',
        		actionWaiting: false,
       			actionSuccess: false
        	})
		default:
			return state;
	}
}