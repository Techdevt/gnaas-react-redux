'use strict';

import config from '../../../config/defaults';
import sendEmail from './email';
import {
    validate,
    duplicateUsernameCheck,
    duplicateEmailCheck,
    createUser,
    resetOutcome,
    createAccount,
    createVerificationToken,
    hasErrors,
    deleteUser,
    editUser
}
from '../accounts';
import httpStatus from 'http-status';
import User from '../models/user';
import FileUtils from './file';
import ImageUtils from './image';
import path from 'path';

export function sendActivationEmail(req, res, options) {
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
    return createUser(userModel);

    console.log(userModel);
    function createUser(userObject) {
        validate(userModel).then(function(userObject) {
            duplicateUsernameCheck(userObject).then(function(userObject) {
                duplicateEmailCheck(userObject).then(function(userObject) {
                    createAccount(userModel).then(function(account) {
                        //save avatar to user directory using user id
                        let ErrorsOccured = {};

                        const fileHandler = new FileUtils();
                        if (req.file) {
                            let sourceFile = req.file.path;
                            let destFile = path.join(appRoot, `/server/uploads/${account.user}/${req.file.filename}`);

                            fileHandler.move(sourceFile, destFile).then(function() {
                                account.avatarUrl = destFile;
                                account.save(function(err, res) {
                                    if (err) return reject(err);
                                    //continue
                                });
                            }, function(err) {
                                //send created error to user with errors
                                ErrorsOccured.avatar = err;
                            });
                        } else {
                            let destFile = '/images/gravatar.png';
                            account.avatarUrl = destFile;
                            account.save(function(err, res) {
                                if (err) return reject(err);
                                //continue
                            });
                        }
                        sendActivationEmail(req, res, {
                            to: userModel.email,
                            verificationToken: account.verificationToken,
                            userId: account.user
                        }).then(function(result) {
                            //?logUserIn
                            return res.status(httpStatus.OK).send({
                                message: 'success'
                            });
                        }, (err) => {
                            return res.status(httpStatus.OK).send(Object.assign(ErrorsOccured, {
                                message: err
                            }));
                        });
                    }, (err) => handleError(res, err));
                }, (err) => handleError(res, err));
            }, (err) => handleError(res, err));
        }, (err) => handleError(res, err));
    }
}

export function deleteUserAccount(req, res) {
    const userId = req.user.id;
    const userPass = req.body.password;
    const acToDelete = req.body.acToDelete || null;

    deleteUser(userId, userPass, acToDelete).then(function(res) {
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

    let fieldsToEdit = {...Object.prototype, ...req.body };

    if (req.file) {
        //reset image
        User.resetImage(acToEdit || userId).then(function(resetResult) {
            //getUserType, if user is merchant, use different dimensions for image
            //process image 400 * 200 for merchant settings page, and 600 width for merchant store page
            fileHelper(req.file, [50, 100, 200], acToEdit || userId).then(function(result) {
                fieldsToEdit.avatarUrl = result;
                editUser(userId, fieldsToEdit, acToEdit).then(function(data) {
                    if (data.token) {
                        req.session.token = data.token;
                        req.session.save((err) => {
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
            if (data.token) {
                req.session.token = data.token;
                req.session.save((err) => {
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
    console.log(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
}

export function fileHelper(images, dimension, userId) {
    let itemArray;
    if (!Array.isArray(images)) {
        itemArray = [images];
    } else {
        itemArray = images;
    }

    const ImageHandler = new ImageUtils();

    return new Promise(function(resolve, reject) {
        ImageHandler.execute(itemArray, dimension).then(function(result) {
            const fileHandler = new FileUtils();
            const promiseArray = [];
            //if typeof result is array we would need to unlink the main file too and then unlink the rest
            result.forEach((item) => {
                    if(!Array.isArray(item)) {
                        const sourceFile = item.path;
                        //use path.join
                        const destFile = path.join(appRoot, `/server/uploads/${userId}/${item.name}`);
                        promiseArray.push(function() {
                            return fileHandler.move(sourceFile, destFile)
                        }());
                    } else {
                        item.forEach(function(i) {
                            promiseArray.push(function(image) {
                                const sourceFile = image.path;
                                const destFile = path.join(appRoot, `/server/uploads/${userId}/${image.name}`);
                                return fileHandler.move(sourceFile, destFile);
                            }(i));
                        });
                    }
            });
            
            Promise.all(promiseArray).then(function(results) {
                resolve(results);
            }, function(err) {
                reject(err);
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
