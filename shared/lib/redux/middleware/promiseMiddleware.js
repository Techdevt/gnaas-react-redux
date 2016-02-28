export default function promiseMiddleware(client) {
  return ({dispatch, getState}) => {
      return next => action => {
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }

        const { promise, type, ...rest } = action;
        
        if (!promise) return next(action);
     
        const SUCCESS = type;

        const REQUEST = type + '_REQUEST';
        const FAILURE = type + '_FAILURE';

        next({ ...rest, type: REQUEST });

        const actionPromise = promise(client);
        actionPromise
          .then(
            (res) => next({...rest, res, type: SUCCESS}),
            (error) => next({...rest, error, type: FAILURE})
          )
          .catch(error => {
            console.error('MIDDLEWARE ERROR:', error);
            next({...rest, error, type: FAILURE});
          });
          return actionPromise;
      };
  };
}