import Immutable from 'immutable';

const defaultState = Immutable.Map({
    isWaiting: false,
    message: '',
    postSuccess: false,
    posts: []
});

export default function AuthReducer(state = defaultState, action) {
    switch (action.type) {
        case 'CREATE_POST_REQUEST':
            return state.set('isWaiting', true);
        case 'CREATE_POST':
            console.log(action.res);
            return state.withMutations((state) => {
                state
                .update('posts', arr => {
                    return arr.concat(action.res.data.post)
                })
                .merge({
                    isWaiting: false,
                    postSuccess: true,
                    message: action.res.data.message
                });
            });
            return ;
        case 'CREATE_POST_FAILURE':
            console.log(action.error);
            return state.merge({
                isWaiting: false,
                postSuccess: false,
                message: action.error
            });
        case 'RESET_MESSAGES': 
            return state.merge({
                isWaiting: false,
                postSuccess: false,
                message: ''
            });
        default:
            return state;
    }
}
