import {expect} from 'chai';
import sendActivationEmail from '../server/api/utils/helpers';
import User from '../server/api/models/user';
import superagent from 'superagent';

describe('email', function() {
    this.timeout(15000);

    //edit to send emails not sendactivationemail

    // it('sends activation emails', function(done) {
    //     superagent.get('http://localhost:3000/sendemail').end(function(err, res) {
    //     	let result = JSON.parse(res.text);
    //     	expect(result.error).to.not.exist;
	   //  	expect(result.result).to.exist;
	   //  	done();
    //     });
    // });
});
