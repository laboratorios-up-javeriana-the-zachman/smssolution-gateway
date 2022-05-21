
'use strict';

const enviroment = require("../../../infraestructure/config/enviroment");

const jwt = require('jsonwebtoken');
const token_functions = {};

token_functions.authortization = function (payload) {

    const signOptions = { expiresIn: enviroment.authentication.expires_in };
    const tokenJwt = jwt.sign(payload, enviroment.authentication.secret, signOptions);
    return tokenJwt;
}

token_functions.verify = function (token) {
    const verifyOptions = {
        expiresIn: enviroment.authentication.expires_in
    };
    return jwt.verify(token, enviroment.authentication.secret, verifyOptions, (err, decoded) => {
        if (err) {
            return { status: 0, error: 'TOKEN_NOT_ALLOWED' };
        } else {
            return { status: 1, data: decoded };
        }
    });
}

module.exports = token_functions;