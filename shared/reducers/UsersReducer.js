import Immutable from 'immutable';

const defaultState = Immutable.Map({
	isLoaded: false,
	actionResult: '',
	actionWaiting: false,
	actionSuccess: false,
	data: []
});

export default function AuthReducer(state = defaultState, action) {
	switch(action.type) {
		case 'GET_USERS':
			return state.merge({
				isLoaded: true,
				data: action.res.data
			});
		case 'GET_USERS_FAILURE':
			return state;
		case 'EDIT_USERS_REQUEST':
            return state.merge({
                actionWaiting: true
            });
        case 'EDIT_USERS':
	        return state.withMutations((state) => {
	            state
	                .update('data', arr => {
	                    const index = arr.findIndex((item) => {
	                        return item.get('_id') === action.res.data.user._id;
	                    });
	                    return arr.set(index, Immutable.fromJS(action.res.data.user));
	                })
	                .merge({
	                    actionResult: 'user edit successfull',
	                    actionWaiting: false,
	                    actionSuccess: true
	                })
	            });
        case 'EDIT_USERS_FAILURE':
            return state.merge({
                actionResult: action.error.data || '',
                actionWaiting: false,
                actionSuccess: false
            });
        case 'CLEAN_ACTION_RESULT': 
        	return state.merge({
        		actionResult: '',
        		actionWaiting: false
        	});
		default:
			return state;
	}
}