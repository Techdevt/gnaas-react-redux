'use strict';

import config from '../../../config/defaults';
import sendEmail from './email';
import {
    validate, duplicateUsernameCheck, duplicateEmailCheck, createUser, resetOutcome, createAccount,
    createVerificationToken, hasErrors, deleteUser, editUser
}
from '../accounts';
import {
    refreshUserSession
}
from './auth';
import httpStatus from 'http-status';
import User from '../models/user';
import FileUtils from './file';
import ImageUtils from './image';

export function sendActivationEmail(req, res, options) {
    console.log(options);
    return new Promise(function(resolve, reject) {
        sendEmail(req, res, {
            from: config.smtp.from.name + ' <' + config.smtp.from.address + '>',
            to: options.to,
            subject: 'Verify Your ' + config.projectName + ' Account',
            textPath: 'email-text',
            htmlPath: 'email-html',
            locals: {
                verifyURL: config.env.devHost + '/activate/' + options.userId + '/' + options.verificationToken + '/',
                projectName: config.projectName,
                date: new Date().toDateString(),
                contactUrl: config.env.devHost + '/contact'
            },
            success: function(message) {
                resolve(message);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

export function sendPasswordResetMail(req, res, options) {
    return new Promise(function(resolve, reject) {
        sendEmail(req, res, {
            from: config.smtp.from.name + ' <' + config.smtp.from.address + '>',
            to: options.to,
            subject: config.projectName + 'Password Reset',
            textPath: 'email-pwdreset-text',
            htmlPath: 'email-pwdreset-html',
            locals: {
                resetURL: config.env.devHost + '/resetpass/' + options.userId + '/' + options.resetToken + '/',
                projectName: config.projectName,
                date: new Date().toDateString()
            },
            success: function(message) {
                resolve(message);
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

export function SignUp(req, res) {
    let userModel = req.body;

    if (userModel.action.type === 'CREATE_DELEGATE') {
        userModel = generateDelegate(userModel);
        createUser(userModel, userModel.merchantId);
    } else {
        createUser(userModel);
    }

    function createUser(userObject, id = null) {
        validate(userModel).then(function(userObject) {
            duplicateUsernameCheck(userObject).then(function(userObject) {
                duplicateEmailCheck(userObject).then(function(userObject) {
                    createAccount(userModel, id).then(function(account) {
                        //save avatar to user directory using user id
                        let ErrorsOccured = {};
                        console.log(account);

                        try {
                            const fileHandler = new FileUtils();
                            if (req.file) {
                                let sourceFile = req.file.path;
                                let destFile = `uploads/${account._id}/${req.file.filename}`;

                                fileHandler.move(sourceFile, destFile).then(function() {
                                    account.avatarUrl = destFile;
                                    if (typeof account === 'object' && account.hasOwnProperty('delegate')) {
                                        account.delegate.avatarUrl = destFile;
                                        account.delegate.save(function(err, res) {
                                            if (err) return reject(err);
                                            account.roles.delegate = res;
                                        });
                                    } else {
                                        account.save(function(err, res) {
                                            if (err) return reject(err);
                                        });
                                    }
                                }, function(err) {
                                    //send created error to user with errors
                                    ErrorsOccured.avatar = err;
                                });
                            } else {
                                let destFile = '/images/gravatar.png';
                                if (typeof account === 'object' && account.hasOwnProperty('delegate')) {
                                    account.delegate.avatarUrl = destFile;
                                    account.delegate.save(function(err, res) {
                                        if (err) return reject(err);
                                        account.roles.delegate = res;
                                    });
                                } else {
                                    account.avatarUrl = [destFile];
                                    account.save(function(err, res) {
                                        if (err) return reject(err);
                                    });
                                }
                            }
                            sendActivationEmail(req, res, {
                                to: userModel.email,
                                verificationToken: account.verificationToken,
                                userId: (account.user) ? account.user.id : account._id
                            }).then(function(result) {
                                //?logUserIn
                                if (userModel.action.type === 'CREATE_DELEGATE') {
                                    refreshUserSession(req, account.merchantId).then(
                                        (isSuccess) => {
                                            delete account.verificationToken;
                                            delete account.merchantId;
                                            delete account.delegate;

                                            return res.status(httpStatus.OK).send({
                                                message: 'success',
                                                type: 'delegate',
                                                password: userModel.password,
                                                username: userModel.username,
                                                delegate: account
                                            });
                                        }, (err) => handleError(res, err)
                                    );
                                } else {
                                    return res.status(httpStatus.OK).send({
                                        message: 'success'
                                    });
                                }
                            }, (err) => {
                                if (userModel.action.type === 'CREATE_DELEGATE') {
                                    refreshUserSession(req, account.merchantId).then(
                                        (isSuccess) => {
                                            delete account.verificationToken;
                                            delete account.merchantId;
                                            delete account.delegate;

                                            return res.status(httpStatus.OK).send({
                                                message: 'success',
                                                type: 'delegate',
                                                password: userModel.password,
                                                username: userModel.username,
                                                delegate: account
                                            });
                                        }, (err) => handleError(res, err)
                                    );
                                } else {
                                    return res.status(httpStatus.OK).send(Object.assign(ErrorsOccured, {
                                        message: err
                                    }));
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    }, (err) => handleError(res, err));
                }, (err) => handleError(res, err));
            }, (err) => handleError(res, err));
        }, (err) => handleError(res, err));
    }
}

export function deleteUserAccount(req, res) {
    var userId = req.body.id;
    var userPass = req.body.password;
    var delegateId = req.body.delegateId || null;

    deleteUser(userId, userPass, delegateId).then(function(res) {
        res.status(httpStatus.OK).send(res);
    }, function(err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    });
}

export function editUserAccount(req, res) {
    // let userId = req.user;
    let userId = req.user._id;
    let acToEdit = req.body.acToEdit;
    delete req.body.acToEdit;


    let fieldsToEdit = {...Object.prototype, ...req.body};

    if (req.file) {
        //reset image
        User.resetImage(acToEdit || userId).then(function(resetResult) {
            //getUsertype, if user is merchant, use different dimensions for image
            //process image 400 * 200 for merchant settings page, and 600 width for merchant store page
            fileHelper(req.file, [50, 100, 200], acToEdit || userId).then(function(result) {
                fieldsToEdit.avatarUrl = result;
                editUser(userId, fieldsToEdit, acToEdit).then(function(data) {
                    if(data.token) {
                        res.session.token = data.token;
                        res.save((err) => {
                            res.status(httpStatus.OK).send(data);
                        });
                    } else {
                        res.status(httpStatus.OK).send(data);
                    }
                }, function(err) {
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
                });
            }, function(err) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
            });
        }, function(resetError) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(resetError);
        });
    } else {
        editUser(userId, fieldsToEdit, acToEdit).then(function(data) {
            if(data.token) {
                res.session.token = data.token;
                res.save((err) => {
                    res.status(httpStatus.OK).send(data);
                });
            } else {
                res.status(httpStatus.OK).send(data);
            }
        }, function(err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        });
    }
}

export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function handleError(res, err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.toString());
}

export function fileHelper(images, dimension, userId) {
    let itemArray;
    if (!images.isArray) {
        itemArray = [images];
    } else {
        itemArray = images;
    }

    const ImageHandler = new ImageUtils();

    return new Promise(function(resolve, reject) {
        ImageHandler.execute(itemArray, dimension).then(function(result) {
            const fileHandler = new FileUtils();
            //if typeof result is array we would need to unlink the main file too and then unlink the rest
            result.forEach(function(item) {
                if (!Array.isArray(item)) {
                    const sourceFile = item.path;
                    const destFile = `server/uploads/${userId}/${item.name}`;
                    fileHandler.move(sourceFile, destFile).then(function(result) {
                        resolve([destFile]);
                    });
                } else {
                    let promises = [];
                    item.forEach(function(i) {
                        promises.push(function(image) {
                            const sourceFile = image.path;
                            const destFile = `server/uploads/${userId}/${image.name}`;
                            return fileHandler.move(sourceFile, destFile);
                        }(i));
                    });



                    Promise.all(promises).then(function(results) {
                        resolve(results);
                    }, function(err) {
                        reject(err);
                    });

                }
            });
        }, function(err) {
            reject(err);
        });
    });
}

export function parseJson(object) {
    if (Object.keys(object).length) {
        Object.keys(object).forEach(function(key) {
            object[key] = JSON.parse(object[key]);
        });
    }
    return object;
}

export function generateDelegate(user) {
    const delegateId = user.delegateId;
    let possibleValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let password = new Array(8).join('p').split('');
    let username = new Array(12).join('u').split('');

    user.username = username.map((val) => {
        const replacePos = Math.random() * possibleValues.length;
        const randValue = possibleValues.slice(0, replacePos).concat(delegateId).concat(possibleValues.slice(replacePos));
        return randValue.charAt(Math.floor(Math.random() * randValue.length));
    }).join('');

    user.password = password.map((val) => {
        return possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
    }).join('');

    return user;
}
