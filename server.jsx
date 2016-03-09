import express                   from 'express';
import path                      from 'path';
import bodyParser                from 'body-parser';
import morgan                    from 'morgan';
import compression               from 'compression';
import uuid                      from 'uuid';
import jwt                       from 'jsonwebtoken';
import session                   from 'express-session';
import sessionStore              from 'connect-mongo';
import Immutable                 from 'immutable';
import mongoose                  from 'mongoose';
import seedData                  from './config/seed';
import { url }                   from './config/database';
import config                    from './config/defaults';
import apiRoutes                 from './config/routes';
import React                     from 'react';
import { renderToString }        from 'react-dom/server';
import { RouterContext, match }  from 'react-router';
import createHistory             from 'react-router/lib/createMemoryHistory';
import routes                    from 'routes';
import { Provider }              from 'react-redux';
import ApiClient                 from 'lib/ApiClient';
import createStore               from 'lib/redux/create';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import Html                      from 'lib/Html';

const app = express();

//add api routes
 
if (process.env.NODE_ENV !== 'production') {
  require('./webpack.dev').default(app);

  // //development::enable chai immutable
  // let chai = require('chai');
  // let chaiImmutable = require('chai-immutable');

  // chai.use(chaiImmutable);
}

let MongoStore = sessionStore(session);

app.use(compression());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.static(path.join(__dirname, 'server')));
app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', 'server/views');
app.set('view engine', 'jade');
app.set('jwtsecret', config.secret);
global.appRoot = path.resolve(__dirname);

//connect to mongodb
mongoose.connect(url);
//seed database
seedData();
// app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(session({ 
  secret: config.secret, 
  genid: function() {
    return uuid.v4()
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: true,
  saveUninitialized : false,
  unset: 'destroy',
  cookie: { 
      maxAge: 604800000, 
      expires: new Date(Date.now() + 604800000)  
    }
  }));

apiRoutes(app);

app.use((req, res) => {
  function getLoggedUser() {
    return new Promise(function(resolve, reject) {
      if(req.session.token) {
        jwt.verify(req.session.token, config.secret, function(err, user) {
          //if(err) reject(err);
          if(user) {
            resolve(Immutable.Map({
                isWaiting: false,
                user: user,
                shouldRedirect: false,
                redirectLocation: '',
                message: '',
                isAuthenticated: true,
                authSuccess: false,
                token: req.session.token
            }));
          }
        });
      } else{
          resolve(Immutable.Map({
            isWaiting: false,
            user: null,
            shouldRedirect: false,
            redirectLocation: '',
            message: '',
            isAuthenticated: false,
            authSuccess: false,
            token: null
          }));
      }
    });
  }

  const client = new ApiClient(req);
  const history = createHistory(req.originalUrl);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      renderToString(<Html store={store}/>));
  }

  getLoggedUser().then(function(Auth) {
    const store = createStore(history, client, {Auth: Auth});
    const location = req.url;
    
     match({ history, routes, location }, (error, redirectLocation, renderProps) => {
          if (redirectLocation) {
            res.redirect(redirectLocation.pathname + redirectLocation.search);
          } else if (error) {
            console.error('ROUTER ERROR:', pretty.render(error));
            res.status(500);
            hydrateOnClient();
          } else if (renderProps) {
            loadOnServer(renderProps, store, {client}).then(() => {
              const component = (
                <Provider store={store} key="provider">
                  <ReduxAsyncConnect {...renderProps} />
                </Provider>
              );

              res.status(200);

              global.navigator = {userAgent: req.headers['user-agent']};
              
              res.send('<!doctype html>\n' +
              renderToString(<Html component={component} store={store}/>));
            });
          } else {
            res.status(404).send('Not found');
          }
     });
  }); 
});

export default app;