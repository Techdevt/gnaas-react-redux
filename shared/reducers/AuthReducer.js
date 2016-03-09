import Immutable from 'immutable';

const defaultState = Immutable.Map({
    isWaiting: false,
    user: null,
    shouldRedirect: false,
    redirectLocation: '',
    message: '',
    authSuccess: false,
    token: null
});

export default function AuthReducer(state = defaultState, action) {
    switch (action.type) {
        case 'CREATE_USER_REQUEST':
            return state.set('isWaiting', true);
        case 'CREATE_USER':
            return state.merge({
                isWaiting: false,
                shouldRedirect: true,
                authSuccess: true,
                message: action.res.data.message,
                redirectLocation: 'login'
            });
        case 'CREATE_USER_FAILURE':
            console.log(action.error);
            return state.merge({
                isWaiting: false,
                authSuccess: false,
                message: action.error
            });
        case 'INITIATE_PASSWORD_RESET_REQUEST':
            return state.merge({
                isWaiting: true
            });
        case 'INITIATE_PASSWORD_RESET':
            console.log(action.res.data);
        case 'INITIATE_PASSWORD_RESET_FAILURE':
            console.log(action.error);
        case 'RESET_PASSWORD_REQUEST':
            return state.merge({
                isWaiting: true
            });
        case 'RESET_PASSWORD':
            console.log(action.res.data);
        case 'RESET_PASSWORD_FAILURE':
            console.log(action.error);
        case 'AUTH_USER_REQUEST':
            return state.merge({
                isWaiting: true
            });
        case 'AUTH_USER':
            //find better implementation of this
            return state.merge({
                isAuthenticated: true,
                user: action.res.data.user,
                token: action.res.data.token,
                isWaiting: false
            });
        case 'AUTH_USER_FAILURE':
            return state.merge({
                isWaiting: false,
                authSuccess: false,
                message: action.error.data,
                user: null
            });
            break;
        case 'EDIT_USER_REQUEST':
            return state.merge({
                isWaiting: true
            });
        case 'EDIT_USER':
            //add edited result object so we can update which fields succeeded
            return state.merge({
                isAuthenticated: true,
                user: action.res.data.user,
                token: action.res.data.token,
                message: action.res.data.message,
                isWaiting: false,
                authSuccess: true
            });
        case 'EDIT_USER_FAILURE':
            return state.merge({
                message: action.error.message || '',
                isWaiting: false,
                authSuccess: false
            });
        case 'DELETE_IMAGE_REQUEST':
            return state.merge({
                isWaiting: true
            });
        case 'DELETE_IMAGE':
            console.log(action.res);
            return state.withMutations((state) => {
                    state
                        .setIn(['user', 'roles', action.res.data.type, 'avatarUrl'], action.res.data.avatar)
                        .merge({
                            isWaiting: false,
                            authSuccess: true,
                            message: 'Avatar reset successful'
                        });
                   
                    });
            //state setin bring user type from backend
        case 'DELETE_IMAGE_FAILURE':
            return state.merge({
                isWaiting: false,
                authSuccess: false
            });
        case 'DELETE_USER_SUCCESS':
            return state.merge({
                isWaiting: false
            });
        case 'DELETE_USER':
            console.log(action.res.data);
            return state.merge({
                isWaiting: false
            });
        case 'DELETE_USER_FAILURE':
            console.log(action.error);
            return state.merge({
                isWaiting: false
            });
        case 'LOGOUT_SUCCESS':
            return state.merge({
                user: null,
                isAuthenticated: false,
                token: null,
                message: action.res.data.message
            });
        case 'CLEAN_AUTH_MESSAGE': 
            return state.merge({
                message: '',
                isWaiting: false
            });
        default:
            return state;
    }
}
