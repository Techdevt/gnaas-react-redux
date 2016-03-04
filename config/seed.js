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

const adminObject2 = {
    username: 'jamperCin',
    password: 'jamperCola',
    firstName: 'Annin',
    lastName: 'Bonsu',
    title: 'Mr.',
    address: 'P.O.Box 480, Kumasi',
    state: 'Ghana',
    location: 'Kumasi',
    email: 'jampercola@gmail.com',
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

                            User.encryptPassword(adminObject2.password, function(err, hash) {
                                if(err) return;
                                adminObject2.password = hash;
                                User.create(adminObject2, function(err, user2) {
                                    adminObject2.user = user2._id;
                                    Admin.create(adminObject2, function(err, admin2) {
                                        if(err)  return;
                                        user2.roles.admin = admin2;
                                        user2.save(function(err, res) {
                                            if(err) return;
                                            return true;
                                        })
                                    });
                                });
                            });
                    	})
                    });
                });
            });
        }
    });
}