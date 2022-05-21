'use strict';

const response_management = require('../server/response.management');
const token_functions = require('../server/token.functions');

module.exports.authenticated = function (request, response) {
    try {
        let token = request.headers.authorization;

        if (token) {
            token = token.replace('Bearer ', '');
        }

        const decoded = token_functions.verify(token);

        if (decoded.status == 1) {
            request.tokenData = decoded.data;
            return response.continue
        } else {
            return response_management.auth_response(response, decoded.error).takeover()
        }
    } catch (error) {
        return response_management.auth_response(response, error).takeover()
    }
}