import express from 'express';
import routes from '../config/routes';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import config from '../config/defaults';

export default function createServer(port) {
    var app = express();

    app.set('views', 'server/views');
	app.set('view engine', 'jade');
	app.set('jwtsecret', config.secret);

	app.use(bodyParser.json()); 
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(morgan('dev'));

	routes(app);

    return app.listen(port);
};
