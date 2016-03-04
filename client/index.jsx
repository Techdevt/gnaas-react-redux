import React       from 'react';
import { render }  from 'react-dom';
import routes      from 'routes';
import { Provider } from 'react-redux';
import immutifyState from 'lib/immutifyState';
import createStore from 'lib/redux/create';
import ApiClient   from 'lib/ApiClient';
import { Router, browserHistory } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

const initialState = immutifyState(window.__INITIAL_STATE__);

const client = new ApiClient();
const history = useScroll(() => browserHistory)();
const store = createStore(history, client, initialState);

const component = (
  <Router render={(props) =>
        <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />
      } history={history}>
    {routes}
  </Router>
);

render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  document.getElementById('App')
);

Promise.prototype.finally = function(onResolveOrReject) {
  return this.catch(function(reason){
    return reason;
  }).then(onResolveOrReject);
};

Promise.prototype.always = function(onResolveOrReject) {
  return this.then(onResolveOrReject,
    function(reason) {
      onResolveOrReject(reason);
    });
};