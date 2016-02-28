'use strict';

import config from './defaults';

module.exports = exports = {
	testUrl: 'mongodb://127.0.0.1/test',
	url: process.env.NPM_CONFIG_PRODUCTION ? `mongodb://${config.dbUser}:${config.dbPass}@${$OPENSHIFT_MONGODB_DB_URL}:${$OPENSHIFT_MONGODB_DB_PORT}/app`: 'mongodb://127.0.0.1/gnaas'
};