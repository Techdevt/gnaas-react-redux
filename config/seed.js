'use strict';
import User from '../server/api/models/user';
import Admin from '../server/api/models/admin';

const adminObject = {
	username: 'adminUser',
	password: 'fanky2010',
	firstName: 'George',
	lastName: 'Woode',
	title: 'Mr.',
	address: 'P.O.Box 480, Kumasi',
	state: 'Ghana',
	location: 'Kumasi',
	email: 'georgewoode@gmail.com',
	permissions: [{
		name: 'adminAccounts',
		permit: true
	},{
		name: 'userAccounts',
		permit: true
	}],
	avatarUrl: ['/images/gravatar.png']
};

export default function seedDatabase() {
    User.find({}, function(err, users) {
        if(err) return;
        if(!users) {
            User.encryptPassword(adminObject.password, function(err, hash) {
                if(err) return;
                adminObject.password = hash;
                User.create(adminObject, function(err, user) {
                    adminObject.user = user._id;
                    Admin.create(adminObject, function(err, admin) {
                    	if(err)  return;
                    	user.roles.admin = admin;
                    	user.save(function(err, user) {
                    		if(err) return;
                    		return true;
                    	})
                    });
                });
            });
        }
    });
}