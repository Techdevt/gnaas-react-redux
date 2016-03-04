import { createStore as _createStore, applyMiddleware, combineReducers } from 'redux';
import createMiddleware from './middleware/promiseMiddleware';
import { syncHistory } from 'react-router-redux';
import * as reducers             from 'reducers';
import thunk                     from 'redux-thunk';

export default function createStore(history, client, data) { 
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = syncHistory(history);

  const middleware = [createMiddleware(client), thunk, reduxRouterMiddleware];
  let finalCreateStore;
  finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const reducer = combineReducers(reducers);
  const store = finalCreateStore(reducer, data);
  
  reduxRouterMiddleware.listenForReplays(store);

  return store;
}