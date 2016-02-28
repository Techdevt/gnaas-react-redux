'use strict';

import {sendActivationEmail, SignUp, deleteUserAccount, editUserAccount, parseJson} from '../server/api/utils/helpers';
import { logUserIn } from '../server/api/accounts';
import User from '../server/api/models/user';
import Auth, { refreshUserSession } from '../server/api/utils/auth';
import httpStatus from 'http-status';
import multer from 'multer';
import path from 'path';
import config from './defaults';
import ImageUtils from '../server/api/utils/image';

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
  } 
});

let limits = { 
    fieldSize: 52428800
}; 

const upload = multer({ storage: storage, limits: limits });

export default function(app) {
    app.post('/user',upload.single('avatar'), function(req, res) {
    	SignUp(req, res);
    });

    app.post('/auth', function(req, res) {
        //login
        logUserIn(req.body.email, req.body.password).then(function(result) {
            //set token in session
            req.session.token = result.token; 
            req.session.save(function(err) {
                res.status(httpStatus.OK).send(result);
            });
        }, function(err) {
            res.status(httpStatus.UNAUTHORIZED).send(err);
        });
        //return token 
    });

    app.post('/logout', function(req, res) {
        req.session.destroy(function(err) {
            res.status(httpStatus.OK).send('logged out');
        });
    });

    // app.post('/files', upload.single('avatar'), function(req, res) {
    //     let file = req.file || req.body.avatar;

    //     const ImageHandler = new ImageUtils();

    //     ImageHandler.execute([file], [600]).then(function(result) {
    //         console.log(result)
    //     }, function(err) {
    //         console.log(err);
    //     });

    //     res.status(httpStatus.OK).send('success');
    // });

    app.post('/activate/:id/:hash', function(req, res) {
        //verify user
        //return result
    });

    app.get('/resetpass/:id/:hash', function(req, res) {
        let params = req.params;
        params.newPass = req.body.newPass;

        User.resetPassword(params, function(err, result){
            if(err) res.status(httpStatus.BAD_REQUEST).send(err);
            res.status(httpStatus.OK).json(result);
        });
    });

    app.post('/resetpass', function(req, res) {
        let fields = req.body;
        User.initiatePasswordReset(req, res, fields);
    });

    app.post('/resetImage', Auth, function(req, res) {
        User.resetImage(req.user._id).then(function(result) {
            refreshUserSession(req, req.user._id).then(function(isSuccess) {
                res.status(httpStatus.OK).send(result);
            }, function(err) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
            });
        }, function(error) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
        });
    });

    app.delete('/user', Auth, function(req, res) {
        deleteUserAccount(req, res);
    });

    app.put('/user', Auth, upload.single('avatar'), function(req, res) {
        parseJson(req.body);
        editUserAccount(req, res);
    });

    app.get('/users', Auth, function(req, res) {
        User.find({}, function(err, users) {
            if(err) {
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
            }
            res.status(httpStatus.OK).send(users);
        });
    });
}