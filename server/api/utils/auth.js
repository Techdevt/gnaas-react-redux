import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../../../config/defaults';
import { getUserType } from '../accounts';
import mongoose from 'mongoose';

export default function Auth(req, res, next) {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    token = req.body.token || req.query.token || token;
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded;
                next();
            }
        });

    } else {
        return res.status(httpStatus.FORBIDDEN).send({
            message: 'unauthorized to access resource'
        });
    }
}

export function refreshUserSession(req, userId) {
    return new Promise(function(resolve, reject) {
        getUserType(userId).then(function(type) {
            mongoose.model('User').findById(userId).populate(`roles.${type}`).exec(function(err, user) {
                if (err) reject(err);
                if(!user) reject('Refresh Failed');
                //find a way to get current session expiration date and set on this
                jwt.sign(user.toObject(), config.secret, {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }, function(token) {
                    req.session.token = token;
                    req.session.save(function(err) {
                        if (err) reject(err);
                        resolve(token);
                    });
                });
            });
        });
    });
}
