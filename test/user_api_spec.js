// import {
//     expect
// }
// from 'chai';
// import {
//     testUrl
// }
// from '../config/database';
// import User from '../server/api/models/user';
// import Merchant from '../server/api/models/merchant';
// import bcrypt from 'bcrypt';
// import {
//     validate, duplicateUsernameCheck, duplicateEmailCheck, createUser, resetOutcome, createAccount,
//     createVerificationToken, logUserIn, deleteUser, editUser
// }
// from '../server/api/accounts';
// import Admin from '../server/api/models/admin';
// import Shopper from '../server/api/models/shopper';
// import SignUp from '../server/api/utils/helpers';
// import superagent from 'superagent';
// import path from 'path';

// const mongoose = require('mongoose');

// mongoose.connect(testUrl);
// let connection = mongoose.connection;

// before(function() {
//     connection.on('open', function() {
//         connection.db.dropDatabase();
//     });
// });

// let userModel = {
//     username: 'Breezy2010',
//     password: 'fanky2010',
//     email: 'fanky5g@gmail.com',
//     town: 'Kwadaso',
//     postCode: '00233',
//     address: 'P.O.Box 480'
// };

// describe('User', function() {

//     describe('User model', function() {
//         it('hash passwords correctly', () => {
//             let expectedValue;
//             User.encryptPassword('fanky2010', function(err, hash) {
//                 if (err) {
//                     return expect.fail();
//                 }
//                 expectedValue = hash;
//             });

//             User.validatePassword('fanky2010', expectedValue, (err, res) => {
//                 if (err) {
//                     return expect.fail();
//                 }
//                 expect(res).to.be(true);
//             });
//         });

//         describe('validation', () => {
//             beforeEach(function() {
//                 resetOutcome();
//             });

//             it('check for wrong username format', () => {
//                 userModel.username = 'Breezy2010~';

//                 validate(userModel).then(function(result) {
//                     // expect(result._id).to.exist;
//                 }, function(err) {
//                     expect(err.errFor.username).to.be.equal('Usernames can only include letters, numbers, and these characters ., -, _, $, @, *, !');
//                 });
//             });

//             it('pass if correct email format is passed', () => {
//                 userModel.username = 'Breezy2010';

//                 validate(userModel).then(function(res) {}, function(err) {
//                     expect(err).to.not.exist;
//                 });
//             });
//         });

//         it('saves user', (done) => {
//             createUser(userModel).then(function(user) {
//                 expect(user._id).to.exist;
//                 done();
//             }, function(err) {
//                 expect(err).to.not.exist;
//             });
//         });

//         it('checks duplicate accounts', (done) => {
//             duplicateUsernameCheck(userModel).then(function(res) {
//                 expect(user).to.not.exist;
//             }, function(err) {
//                 expect(err.errFor.username).to.equal('username already taken');
//             });

//             duplicateEmailCheck(userModel).then(function(res) {
//                 expect(user).to.not.exist;
//             }, function(err) {
//                 expect(err.errFor.username).to.equal('email already registered');
//             });
//             done();
//         });

//         describe('initiate password reset', function() {
//             this.timeout(150000);
//             it('checks if user exists in system', function(done) {
//                 superagent.post('http://localhost:3000/resetpass').send({
//                         email: 'fanky5g@live.com'
//                     }).set('Accept', 'application/json')
//                     .end(function(err, result) {
//                         expect(err.status).to.be.equal(400);
//                         expect(err.response.text).to.be.equal('Corresponding user not found in system');
//                         done();
//                     });
//             });

//             it('generates reset token', function(done) {
//                 superagent.post('http://localhost:3000/resetpass').send({
//                         email: 'fanky5g@gmail.com'
//                     }).set('Accept', 'application/json')
//                     .end(function(err, result) {
//                         expect(err).to.not.exist;
//                         expect(result).to.exist;
//                         done();
//                     });
//             });

//             it('verifies password reset token and sets new password', function(done) {
//                 var expectedResult = 'password_reset_success';
//                 let testUser = {
//                     username: 'Doggie92',
//                     password: 'fanky2010',
//                     email: 'appiahbrobbeybenjamin@rocketmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480'
//                 };

//                 createUser(testUser).then(function(user) {
//                     User.createVerificationToken(function(err, token, hash) {
//                         user.resetPasswordToken = token;
//                         user.save(function(err, updatedUser) {
//                             expect(err).to.not.exist;
//                             let params = {
//                                 id: user.id,
//                                 newPass: 'gold59',
//                                 hash: hash
//                             };
//                             User.resetPassword(params, function(err, result) {
//                                 expect(err).to.not.exist;
//                                 expect(result.message).to.be.equal(expectedResult);
//                                 done();
//                             });
//                         });
//                     });
//                 }, function(error) {
//                     expect(error).to.not.exist;
//                 });
//             });
//         });

//         describe('authentication', function() {
//             this.timeout(150000);
//             it('issues tokens on login', (done) => {
//                 logUserIn('fanky5g@gmail.com', 'fanky2010')
//                     .then(function(result) {
//                         expect(result.token).to.exist;
//                         done();
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                         done();
//                     });
//             });

//             it('should only allow verified users to login');

//             describe('authenticate routes', function() {
//                 it('denies unauthorized users', function(done) {
//                     superagent.get('http://localhost:3000/api/users').end(function(err, res) {
//                         expect(res.body.message).to.equal('unauthorized to access resource');
//                         done();
//                     });
//                 });

//                 it('accesses resource if authorized', function(done) {
//                     logUserIn('fanky5g@gmail.com', 'fanky2010')
//                         .then(function(result) {
//                             superagent.get('http://localhost:3000/api/users')
//                                 .set('x-access-token', result.token)
//                                 .end(function(err, res) {
//                                     expect(res.body).to.exist;
//                                     done();
//                                 });
//                         }, function(err) {
//                             expect(err).to.not.exist;
//                             done();
//                         });
//                 });

//             });
//         });
//     });

//     describe('admin', () => {
//         beforeEach(function(done) {
//             const admin = require('../server/api/models/admin');
//             admin.remove({}, function(err, result) {
//                 User.remove({}, done);
//             });
//         });

//         let adminModel = {
//             action: {
//                 type: 'CREATE_ADMIN'
//             },
//             fname: 'Benjamin',
//             lname: 'Appiah-Brobbey',
//             permissions: [{
//                 name: 'userAccounts',
//                 permit: true
//             }],
//             username: 'adminUser',
//             password: 'fanky2010',
//             email: 'adminEmail@gmail.com',
//             town: 'Kwadaso',
//             postCode: '00233',
//             address: 'P.O.Box 480'
//         };

//         it('should be able to save', function(done) {
//             createAccount(adminModel).then(function(admin) {
//                 expect(admin._id).to.exist;
//                 done();
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });
//         });

//         it('should only access features if it has permission', function(done) {
//             createAccount(adminModel).then(function(admin) {
//                 expect(admin.hasPermissionTo('userAccounts')).to.be.equal(true);
//                 done();
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });
//         });
//     });

//     describe('shopper', function() {
//         this.timeout(15000);

//         let savedShopper;
//         let shopperModel = {
//             action: {
//                 type: 'CREATE_SHOPPER'
//             },
//             title: 'Mr.',
//             fname: 'Benjamin',
//             lname: 'Appiah-Brobbey',
//             avatarUrl: 'http://localhost/breezy/breezy.jpg',
//             homePhone: '+233545385122',
//             mobilePhone: '+233545385122',
//             gender: 'M'
//         };

//         let baseShopper = {
//             action: {
//                 type: 'CREATE_SHOPPER'
//             },
//             user: {},
//             username: 'goat5',
//             password: 'fanky2010',
//             email: 'fanky5g@live.com',
//             town: 'Kwadaso',
//             postCode: '00233',
//             address: 'P.O.Box 480',
//             title: 'Mr.',
//             fname: 'Benjamin',
//             lname: 'Appiah-Brobbey',
//             avatarUrl: 'http://localhost/breezy/breezy.jpg',
//             homePhone: '+233545385122',
//             mobilePhone: '+233545385122',
//             gender: 'M'
//         };

//         beforeEach(function(done) {
//             resetOutcome();
//             User.remove({}, function() {
//                 Shopper.remove({}, done);
//             });
//         });

//         it('creates verification tokens', (done) => {
//             shopperModel = Object.assign(shopperModel, userModel);
//             createAccount(shopperModel).then(function(shopper) {
//                 expect(shopper.verificationToken).to.exist;
//                 done();
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });
//         });

//         it('verifies a shopper', function(done) {
//             let ltoken = 'fanky2010',
//                 lhash;

//             User.encryptPassword(ltoken, function(err, hash) {
//                 if (err) {
//                     expect.fail();
//                 }
//                 lhash = hash;
//                 baseShopper.verificationToken = ltoken;
//                 User.create(baseShopper, function(err, userItem) {
//                     expect(err).to.not.exist;
//                     if (userItem) {
//                         baseShopper.user.id = userItem._id;
//                         Shopper.create(baseShopper, function(err, shopper) {
//                             expect(err).to.not.exist;
//                             userItem.roles.shopper = shopper._id;
//                             userItem.save(function(err, user) {
//                                 expect(err).to.not.exist;
//                                 User.verifyUser(shopper.user.id, lhash, function(err, result) {
//                                     expect(err).to.not.exist;
//                                     expect(result).to.be.true;
//                                     done();
//                                 });
//                             });
//                         });
//                     }
//                 });
//             });
//         });

//         it('should register a shopper', (done) => {
//             delete baseShopper.user;
//             superagent.post('http://localhost:3000/user').send(baseShopper).set('Accept', 'application/json')
//                 .end(function(err, res) {
//                     expect(err).to.not.exist;
//                     done();
//                 }); 
//         });

//         it('should register a shopper and save attached profile picture', function(done) {
//             let newbaseshopper = Object.assign({}, baseShopper, {username: 'baseWithPic', email: 'basewithpic@gmail.com'});
//             superagent.post('http://localhost:3000/user')
//                 .attach('avatar', path.join(__dirname, 'avatar.jpg'))
//                 .field('action[type]', 'CREATE_SHOPPER')
//                 .field('username', 'basewithpic')
//                 .field('password', 'fanky2010')
//                 .field('email', 'basewithpic@gmail.com')
//                 .field('town', 'kwadaso')
//                 .field('postCode', '00233')
//                 .field('address', 'P.O.Box 480')
//                 .field('title', 'Mr')
//                 .field('fname', 'Benjamin')
//                 .field('lname', 'Appiah-Brobbey')
//                 .end(function(err, res) {
//                     expect(err).to.not.exist;
//                     done();
//                 });
//         });
//     });

//     describe('merchant', function() {
//         let savedMerchant;
//         it('adds a merchant', function(done) {
//             let merchantModel = {
//                 action: {
//                     type: 'CREATE_MERCHANT'
//                 },
//                 username: 'fanky2010',
//                 password: 'fankygold59',
//                 email: 'goldenmerchant@gmail.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480',
//                 companyName: 'Gold Limited',
//                 logoUrl: 'C:/Breezy/breezy.jpg',
//                 phone: '0545385122'
//             };

//             createAccount(merchantModel).then(function(result) {
//                 savedMerchant = result;
//                 expect(result._id).to.exist;
//                 done();
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });

//         });

//         it('creates delegates', function(done) {
//             let delegateObject = {
//                 action: {
//                     type: 'CREATE_DELEGATE'
//                 },
//                 logoUrl: 'C:/Breezy/breezy.jpg',
//                 phone: '0545385122'
//             };
//             delegateObject = Object.assign(delegateObject, userModel, {
//                 email: 'delegateuser@gmail.com',
//                 username: 'delegateuser'
//             });

//             createAccount(delegateObject, savedMerchant._id).then(function(result) {
//                 expect(result.id).to.exist;
//                 done();
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });
//         });

//     });

//     describe('delete', function() {
//         this.timeout(15000);
//         it('an admin', function(done) {
//             //create two admins
//             //give one permission of adminAccounts
//             // userId, password, acToDelete
//             let superAdmin = {
//                 action: {
//                     type: 'CREATE_ADMIN'
//                 },
//                 fname: 'Benjamin',
//                 lname: 'Appiah-Brobbey',
//                 permissions: [{
//                     name: 'adminAccounts',
//                     permit: true
//                 }],
//                 username: 'superAdmin',
//                 password: 'fanky2010',
//                 email: 'superAdmin@gmail.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480'
//             };

//             let subAdmin = {
//                 action: {
//                     type: 'CREATE_ADMIN'
//                 },
//                 fname: 'Benjamin',
//                 lname: 'Appiah-Brobbey',
//                 permissions: [{
//                     name: 'userAccounts',
//                     permit: true
//                 }],
//                 username: 'subAdmin',
//                 password: 'fanky2010',
//                 email: 'subAdmin@gmail.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480'
//             };

//             createAccount(superAdmin).then(function(supAdmin) {
//                 createAccount(subAdmin).then(function(sAdmin) {
//                     deleteUser(supAdmin.user.id, 'fanky2010', sAdmin.user.id).then(function(res) {
//                         expect(res.message).to.be.equal('success');
//                         done();
//                     }, function(err) {
//                         expect(err).to.be.null;
//                         done();
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                     done();
//                 });
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });
//         });

//         it('a shopper', function(done) {
//             let testShopper = {
//                 action: {
//                     type: 'CREATE_SHOPPER'
//                 },
//                 username: 'testshopper',
//                 password: 'fanky2010',
//                 email: 'testshopper@live.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480',
//                 title: 'Mr.',
//                 fname: 'Benjamin',
//                 lname: 'Appiah-Brobbey',
//                 avatarUrl: 'http://localhost/breezy/breezy.jpg',
//                 homePhone: '+233545385122',
//                 mobilePhone: '+233545385122',
//                 gender: 'M'
//             };

//             createAccount(testShopper).then(function(shopper) {
//                 deleteUser(shopper.user.id, 'fanky2010').then(function(res) {
//                     expect(res.message).to.be.equal('success');
//                     done();
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                     done();
//                 });
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });
//         });
//         it('a merchant', function(done) {
//             let testMerchant = {
//                 action: {
//                     type: 'CREATE_MERCHANT'
//                 },
//                 username: 'testmerchant',
//                 password: 'fanky2010',
//                 email: 'testmerchant@gmail.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480',
//                 companyName: 'Gold Limited',
//                 logoUrl: 'C:/Breezy/breezy.jpg',
//                 phone: '0545385122'
//             };

//             let testDelegate = {
//                 action: {
//                     type: 'CREATE_DELEGATE'
//                 },
//                 username: 'testdelegate',
//                 password: 'fanky2010',
//                 email: 'testdelegate@gmail.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480',
//                 logoUrl: 'C:/Breezy/breezy.jpg',
//                 phone: '0545385122'
//             };

//             //create a delegate associated with merchant


//             createAccount(testMerchant).then(function(merchant) {
//                 createAccount(testDelegate, merchant._id).then(function(del) {
//                     deleteUser(merchant.user.id, 'fanky2010').then(function(res) {
//                         expect(res.message).to.be.equal('success');
//                         done();
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                         done();
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                     done();
//                 });
//             }, function(err) {
//                 expect(err).to.not.exist;
//                 done();
//             });
//         });

//         it('a delegate cannot delete his account', function(done) {
//             let newDelegate = {
//                 action: {
//                     type: 'CREATE_DELEGATE'
//                 },
//                 username: 'newDelegate',
//                 password: 'fanky2010',
//                 email: 'newDelegate@gmail.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480',
//                 logoUrl: 'C:/Breezy/breezy.jpg',
//                 phone: '0545385122'
//             };

//             let newMerchant = {
//                 action: {
//                     type: 'CREATE_MERCHANT'
//                 },
//                 username: 'newMerchant',
//                 password: 'fanky2010',
//                 email: 'newMerchant@gmail.com',
//                 town: 'Kwadaso',
//                 postCode: '00233',
//                 address: 'P.O.Box 480',
//                 companyName: 'Gold Limited',
//                 logoUrl: 'C:/Breezy/breezy.jpg',
//                 phone: '0545385122'
//             };
//             //have to create merchant
//             createAccount(newMerchant).then(function(merchant) {
//                 createAccount(newDelegate, merchant._id).then(function(newd) {
//                     deleteUser(newd.user.id, 'fanky2010').then(function(res) {
//                         // expect(res.message).to.be.equal('delete failed');
//                         // done();
//                     }, function(err) {
//                         //delegate cannot delete own account
//                         expect(err).to.exist;
//                         done();
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                     done();
//                 });
//             }, function(err) {
//                 console.log(err);
//                 expect(err).to.not.exist;
//             });
//         });
//     });

//     describe('edit', function() {
//         describe('own account', function() {
//             this.timeout(15000);
//             it('admin edit his own account', function(done) {
//                 let editAdmin = {
//                     action: {
//                         type: 'CREATE_ADMIN'
//                     },
//                     fname: 'Benjamin',
//                     lname: 'Appiah-Brobbey',
//                     permissions: [{
//                         name: 'adminAccounts',
//                         permit: true
//                     }],
//                     username: 'editAdmin',
//                     password: 'fanky2010',
//                     email: 'editAdmin@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480'
//                 };

//                 createAccount(editAdmin).then(function(newAdmin) {
//                     let fieldsToEdit = {
//                         username: 'editedUser',
//                         password: 'mynewpassword2010',
//                         roles: [{
//                             type: 'ADD_ROLE',
//                             value: {
//                                 name: 'userAccounts',
//                                 permit: true
//                             }
//                         }]
//                     };

//                     editUser(newAdmin.user.id, fieldsToEdit).then(function(result) {
//                         expect(result.message).to.be.equal('update_success');
//                         done();
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                         done();
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                     done();
//                 });
//             });
//             //merchant edit his own account //if password is present expect password not to change

//             it('merchant edit his own account', function(done) {
//                 let newMerchant = {
//                     action: {
//                         type: 'CREATE_MERCHANT'
//                     },
//                     username: 'Thisisamerchant',
//                     password: 'fanky2010',
//                     email: 'thismerchant@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480',
//                     companyName: 'Gold Limited',
//                     logoUrl: 'C:/Breezy/breezy.jpg',
//                     phone: '0545385122'
//                 };
//                 createAccount(newMerchant).then(function(res) {
//                     let fieldsToEdit = {
//                         username: 'editedMerchant',
//                         password: 'merchantnewpassword',
//                         companyName: 'Mercurial'
//                     };
//                     editUser(res.user.id, fieldsToEdit).then(function(result) {
//                         expect(result.message).to.be.equal('update_success');
//                         done();
//                     }, function(err) {
//                         console.log(err);
//                         expect(err).to.not.exist;
//                     });
//                 }, function(err) {
//                     console.log(err);
//                     expect(err).to.not.exist;
//                 });
//             });
//             //shopper edit his own account
//             it('shopper edit his own account', function(done) {
//                 let newShopper = {
//                     action: {
//                         type: 'CREATE_SHOPPER'
//                     },
//                     username: 'editingshopper',
//                     password: 'fanky2010',
//                     email: 'editingshopper@live.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480',
//                     title: 'Mr.',
//                     fname: 'Benjamin',
//                     lname: 'Appiah-Brobbey',
//                     avatarUrl: 'http://localhost/breezy/breezy.jpg',
//                     homePhone: '+233545385122',
//                     mobilePhone: '+233545385122',
//                     gender: 'M'
//                 };

//                 createAccount(newShopper).then(function(shopper) {
//                     let fieldsToEdit = {
//                         username: 'newShopper',
//                         password: 'newshopperpassword',
//                         title: 'Mrs'
//                     };
//                     editUser(shopper.user.id, fieldsToEdit).then(function(result) {
//                         expect(result.message).to.be.equal('update_success');
//                         done();
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                 });
//             });
//             //delegate edit his own account //delegate cannot add roles to his own account
//             it('delegate edit own account', function(done) {
//                 let newDelegate = {
//                     action: {
//                         type: 'CREATE_DELEGATE'
//                     },
//                     logoUrl: 'C:/Breezy/breezy.jpg',
//                     phone: '0545385122',
//                     email: 'newdelegate2@gmail.com',
//                     username: 'newdelegateedit',
//                     password: 'fanky2010'
//                 };

//                 let newMerchant = {
//                     action: {
//                         type: 'CREATE_MERCHANT'
//                     },
//                     username: 'thisisanewmerchant',
//                     password: 'fanky2010',
//                     email: 'newmaerchant@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480',
//                     companyName: 'Gold Limited',
//                     logoUrl: 'C:/Breezy/breezy.jpg',
//                     phone: '0545385122'
//                 };

//                 createAccount(newMerchant).then(function(merchant) {
//                     createAccount(newDelegate, merchant._id).then(function(delegate) {
//                         let fieldsToEdit = {
//                             username: 'newdelegateediting',
//                             password: 'newdelegatepassword',
//                             email: 'anotherdelegate@gmail.com'
//                         };
//                         //email check..expect failure
//                         editUser(delegate.user.id, fieldsToEdit).then(function(result) {
//                             expect(result.message).to.be.equal('update_success');
//                             done();
//                         }, function(err) {
//                             expect(err).to.not.exist;
//                         });
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                 });
//             });
//         });

//         describe('other accounts', function() {
//             //admin edit other admin accounts => check admin roles
//             it('admin edit admin', function(done) {
//                 let superAdmin = {
//                     action: {
//                         type: 'CREATE_ADMIN'
//                     },
//                     fname: 'Benjamin',
//                     lname: 'Appiah-Brobbey',
//                     permissions: [{
//                         name: 'adminAccounts',
//                         permit: true
//                     }],
//                     username: 'newSuperAdmin',
//                     password: 'fanky2010',
//                     email: 'newSuperAdmin@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480'
//                 };

//                 let subAdmin = {
//                     action: {
//                         type: 'CREATE_ADMIN'
//                     },
//                     fname: 'Benjamin',
//                     lname: 'Appiah-Brobbey',
//                     username: 'newSubAdmin',
//                     password: 'fanky2010',
//                     permissions: [{
//                         name: 'userAccounts',
//                         permit: true
//                     }, {
//                         name: 'adminAccounts',
//                         permit: true
//                     }],
//                     email: 'newSubAdmin@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480'
//                 };

//                 createAccount(superAdmin).then(function(sa) {
//                     createAccount(subAdmin).then(function(suba) {
//                         let fieldsToEdit = {
//                             roles: [{
//                                 action: 'REMOVE_ROLE',
//                                 value: {
//                                     name: 'userAccounts',
//                                     permit: true
//                                 }
//                             }],
//                             password: 'newPassword'
//                         };
//                         editUser(sa.user.id, fieldsToEdit, suba.user.id).then(function(result) {
//                             expect(result.message).to.be.equal('success');
//                             done();
//                         }, function(err) {
//                             expect(err).to.not.exist;
//                         });
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                 })
//             });

//             it('admin edit delegate', function(done) {
//                 let superAdmin = {
//                     action: {
//                         type: 'CREATE_ADMIN'
//                     },
//                     fname: 'Benjamin',
//                     lname: 'Appiah-Brobbey',
//                     permissions: [{
//                         name: 'adminAccounts',
//                         permit: true
//                     }, {
//                         name: 'userAccounts',
//                         permit: true
//                     }],
//                     username: 'superadminone',
//                     password: 'fanky2010',
//                     email: 'superadminone@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480'
//                 };

//                 let newDelegate = {
//                     action: {
//                         type: 'CREATE_DELEGATE'
//                     },
//                     username: 'newDelegateone',
//                     password: 'fanky2010',
//                     email: 'newDelegateone@gmail.com',
//                     town: 'Kwadaso',
//                     roles: [{
//                         name: 'inventory',
//                         permit: true
//                     }],
//                     postCode: '00233',
//                     address: 'P.O.Box 480',
//                     logoUrl: 'C:/Breezy/breezy.jpg',
//                     phone: '0545385122'
//                 };

//                 let newMerchant = {
//                     action: {
//                         type: 'CREATE_MERCHANT'
//                     },
//                     username: 'newMerchantone',
//                     password: 'fanky2010',
//                     email: 'newMerchantone@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480',
//                     companyName: 'Gold Limited',
//                     logoUrl: 'C:/Breezy/breezy.jpg',
//                     phone: '0545385122'
//                 };
//                 //have to create merchant
//                 createAccount(superAdmin).then(function(admin) {
//                     createAccount(newMerchant).then(function(merchant) {
//                         createAccount(newDelegate, merchant._id).then(function(newd) {
//                             let fieldsToEdit = {
//                                 roles: [{
//                                     action: 'REMOVE_ROLE',
//                                     value: {
//                                         name: 'inventory',
//                                         permit: true
//                                     }
//                                 }],
//                                 password: 'delegateoneonone'
//                             };

//                             editUser(admin.user.id, fieldsToEdit, newd.user.id).then(function(result) {
//                                 expect(result.message).to.be.equal('update_success');
//                                 done();
//                             }, function(err) {
//                                 expect(err).to.not.exist;
//                             })
//                         }, function(err) {
//                             expect(err).to.not.exist;
//                             done();
//                         });
//                     }, function(err) {
//                         console.log(err);
//                         expect(err).to.not.exist;
//                     });
//                 }, function(err) {
//                     console.log(err);
//                     expect(err).to.not.exist;
//                 });
//             });

//             it('admin edit shopper', function(done) {
//                 let superAdmin = {
//                     action: {
//                         type: 'CREATE_ADMIN'
//                     },
//                     fname: 'Benjamin',
//                     lname: 'Appiah-Brobbey',
//                     permissions: [{
//                         name: 'userAccounts',
//                         permit: true
//                     }],
//                     username: 'admineditingshopper',
//                     password: 'fanky2010',
//                     email: 'admineditingshopper@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480'
//                 };
//                 let newShopper = {
//                     action: {
//                         type: 'CREATE_SHOPPER'
//                     },
//                     username: 'shoppereditedbyadmin',
//                     password: 'fanky2010',
//                     email: 'shoppereditedbyadmin@live.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480',
//                     title: 'Mr.',
//                     fname: 'Benjamin',
//                     lname: 'Appiah-Brobbey',
//                     avatarUrl: 'http://localhost/breezy/breezy.jpg',
//                     homePhone: '+233545385122',
//                     mobilePhone: '+233545385122',
//                     gender: 'M'
//                 };

//                 createAccount(superAdmin).then(function(admin) {
//                     createAccount(newShopper).then(function(shopper) {
//                         let fieldsToEdit = {
//                             username: 'Breezydeal',
//                             password: 'newpassword2010',
//                             fname: 'Brosquento'
//                         };
//                         editUser(admin.user.id, fieldsToEdit, shopper.user.id).then(function(result) {
//                             expect(result.message).to.be.equal('update_success');
//                             done();
//                         }, function(err) {
//                             expect(err).to.not.exist;
//                         });
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                 });
//             });
//             // //merchant edits delegates and add roles
//             it('merchant edits delegates', function(done) {
//                 //add roles //remove roles
//                 let newDelegate = {
//                     action: {
//                         type: 'CREATE_DELEGATE'
//                     },
//                     logoUrl: 'C:/Breezy/breezy.jpg',
//                     phone: '0545385122',
//                     email: 'delegateedited@gmail.com',
//                     username: 'delegateedited',
//                     password: 'fanky2010'
//                 };

//                 let newMerchant = {
//                     action: {
//                         type: 'CREATE_MERCHANT'
//                     },
//                     username: 'merchantEditDelegates',
//                     password: 'fanky2010',
//                     email: 'merchantEditDelegates@gmail.com',
//                     town: 'Kwadaso',
//                     postCode: '00233',
//                     address: 'P.O.Box 480',
//                     companyName: 'Gold Limited',
//                     logoUrl: 'C:/Breezy/breezy.jpg',
//                     phone: '0545385122'
//                 };

//                 createAccount(newMerchant).then(function(merchant) {
//                     createAccount(newDelegate, merchant._id).then(function(delegate) {
//                         let fieldsToEdit = {
//                             username: 'delegatehasbeenedited',
//                             email: 'delegatehasbeenedited@gmail.com',
//                             roles: [{
//                                 action: 'ADD_ROLE',
//                                 value: {
//                                     name: 'inventory',
//                                     permit: true
//                                 }
//                             }]
//                         };
//                         //email check..expect failure
//                         editUser(merchant.user.id, fieldsToEdit, delegate.user.id).then(function(result) {
//                             expect(result.message).to.be.equal('update_success');
//                             done();
//                         }, function(err) {
//                             expect(err).to.not.exist;
//                         });
//                     }, function(err) {
//                         expect(err).to.not.exist;
//                     });
//                 }, function(err) {
//                     expect(err).to.not.exist;
//                 });
//             });
//         });
//     });
// });

// after(function() {
//     connection.close();
// });
