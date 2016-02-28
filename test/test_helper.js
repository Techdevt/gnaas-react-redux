import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

import createServer from './test_server';
var app = createServer(3000);