'use strict';

import mongoose from 'mongoose';
import crypto from 'crypto';
import {
    sendPasswordResetMail,
    toTitleCase
}
from '../utils/helpers';
import httpStatus from 'http-status';
import {
    getUserType
}
from '../accounts';
import FileUtils from '../utils/file';
import autopopulate from 'mongoose-autopopulate';

let UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: {
        type: String,
        unique: true
    },
    roles: {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            autopopulate: true
        },
        shopper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shopper',
            autopopulate: true
        },
        merchant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Merchant',
            autopopulate: true
        },
        delegate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Delegate',
            autopopulate: true
        }
    },
    isActive: Boolean,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    location: String,
    state: String,
    postCode: String,
    address: [String]
});

UserSchema.methods.canPlayRoleOf = (role) => {
    if (role === 'admin' && this.roles.admin) {
        return true;
    }

    if (role === 'shopper' && this.roles.shopper) {
        return true;
    }

    if (role === 'merchant' && this.roles.merchant) {
        return true;
    }


    return false;
};

UserSchema.statics.initiatePasswordReset = (req, res, fields) => {
    mongoose.model('User').findOne(fields, function(err, user) {
        if (err) return done(err);

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).send('Corresponding user not found in system');
        }
        mongoose.model('User').createVerificationToken(function(err, token, hash) {
            let d = new Date();

            user.resetPasswordToken = token;
            user.resetPasswordExpires = d.setDate(d.getDate() + 2);
            user.save(function(err, retUser) {
                if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                sendPasswordResetMail(req, res, {
                    to: user.email,
                    userId: user._id,
                    resetToken: hash
                }).then(function(result) {
                    res.status(httpStatus.OK).send({
                        message: 'success'
                    });
                }, function(err) {
                    console.log(err);
                    return res.status(httpStatus.BAD_REQUEST).send(err);
                });
            });
        });
    });
};

UserSchema.statics.resetPassword = function(params, done) {
    mongoose.model('User').findOne({
        _id: params.id
    }, function(err, user) {
        if (err) return done(err);
        if (!user) return done('Matching account not found');

        mongoose.model('User').validatePassword(params.newPass, user.password, function(err, result) {
            if (err) return done('Internal Server Error');
            if (result) {
                return done('New password cannot be equal to previously used passwords');
            } else {

                function verifyPasswordPermission() {
                    let verificationPass = false;
                    return new Promise(function(resolve, reject) {
                        if (params.hasOwnProperty('isAdminResetPassword') && params.isAdminResetPassword == true) {
                            //skip verificationToken inspection
                            verificationPass = true;
                            return resolve(verificationPass);
                        } else {
                            mongoose.model('User').validatePassword(user.resetPasswordToken, params.hash, function(err, result) {
                                if (err || !result) {
                                    verificationPass = false;
                                    return reject(verificationPass);
                                }
                                verificationPass = true;
                                return resolve(verificationPass);
                            });
                        }
                    });
                }

                verifyPasswordPermission().then(function(result) {
                    if (result) {
                        let d = new Date();

                        if (!params.hasOwnProperty('isAdminResetPassword')) {
                            if ((user.resetPasswordExpires - d) < 0) return done('Token Expired');
                        }

                        mongoose.model('User').encryptPassword(params.newPass, function(err, hash) {
                            if (err) return done(err);
                            user.password = hash;
                            user.save(function(err, updatedUser) {
                                if (err) return done(err);
                                return done(null, {
                                    message: 'password_reset_success'
                                });
                            });
                        });

                    } else {
                        return done('Password Reset Failed!!! Token mismatch');
                    }
                }, function(err) {
                    return done(err);
                });
            }
        });
    });
};

UserSchema.statics.createVerificationToken = function(done) {
    crypto.randomBytes(21, function(err, buf) {
        if (err) {
            return done(err);
        }

        var token = buf.toString('hex');
        mongoose.model('User').encryptPassword(token, function(err, hash) {
            if (err) return done(err);
            done(null, token, hash);
        });
    });
};

UserSchema.statics.encryptPassword = function(password, done) {
    var bcrypt = require('bcrypt');

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return done(err);
        }

        bcrypt.hash(password, salt, function(err, hash) {
            done(err, hash);
        });
    });
};

UserSchema.statics.validatePassword = (password, hash, done) => {
    var bcrypt = require('bcrypt');
    bcrypt.compare(password, hash, function(err, res) {
        done(err, res);
    });
};

UserSchema.statics.verifyUser = function(id, hash, done) {
    let token;
    mongoose.model('User').findOne({
        _id: id
    }, function(err, user) {
        if (err) return done(err);
        if (user.roles.shopper) {
            mongoose.model('Shopper').findOne({
                _id: user.roles.shopper
            }, function(err, shopper) {
                if (err) return done(err);
                token = shopper.verificationToken;

                mongoose.model('User').validatePassword(token, hash, function(err, res) {
                    if (err) return done(err);
                    if (res) {
                        shopper.isVerified = true;
                        shopper.save(function(err, shopper) {
                            if (err) return done(err);
                            return done(null, true);
                        });
                    } else {
                        return done('verification failed');
                    }
                })
            });
        } else if (user.roles.merchant) {
            mongoose.model('Merchant').findOne({
                _id: user.roles.merchant
            }, function(err, merchant) {
                if (err) return done(err);
                token = merchant.verificationToken;

                mongoose.model('User').validatePassword(token, hash, function(err, res) {
                    if (err) return done(err);
                    if (res) {
                        merchant.isVerified = true;
                        merchant.save(function(err, merchant) {
                            if (err) return done(err);
                            return done(null, true);
                        });
                    } else {
                        return done('verification failed');
                    }
                })
            });
        } else {
            return done('verification failed');
        }
    });
};

UserSchema.statics.resetImage = (userId) => {
    return new Promise(function(resolve, reject) {
        getUserType({
            _id: userId
        }).then(function(type) {
            mongoose.model('User').findById(userId, function(err, user) {
                if (err) reject(err);
                const FileHandler = new FileUtils();
                const avatar = user.roles[type].avatarUrl;
                FileHandler.delete(avatar).then(function(result) {
                    user.roles[type].avatarUrl = ['/images/gravatar.png'];
                    try {
                        user.roles[type].save(function(err, res) {
                            if(err) reject(err);
                            resolve({
                                type: type,
                                avatar: res.avatarUrl
                            });
                        });
                    } catch(err) {
                        console.log(err);
                    }
                    
                }, function(err) {
                    reject(err);
                });

                    
            });
        }, function(err) {
            reject(err);
        });
    });
};

UserSchema.plugin(autopopulate);

UserSchema.index({
    username: 1,
    unique: true
});
UserSchema.index({
    email: 1,
    unique: true
});
UserSchema.index({
    dateCreated: 1
});

export default mongoose.model('User', UserSchema);
