'use strict';

const request = require('request-promise');

const controller = {};
const response_management = require('../../application/protected/server/response.management');
const JsonFunctions = require('../../application/utils/json.functions');
const enviroment = require('../../infraestructure/config/enviroment');

const services = [
    { origin_path: "smssolutions", destination_path: "smssolution/ping", port: 8181 },
];
let urlPath;

// Filter controller, redirect to services bussines logic.
controller.filter = async function (req, res) {
    urlPath = req.params.pathurl;

    let destination_service = services.map(getServiceInformation)[0];
    const uri = `${enviroment.gateway.url}:${destination_service.port}/${destination_service.path}`;
    try {
        delete req.params.pathurl;
        await request(uri, req.params);
    } catch (error) {
        console.log(error);
        return response_management.custom_response(res, error.statusCode, JSON.parse(error.error));
    }

    return response_management.custom_response(res, 200, 'pong');
}

// Filter controller, redirect to services bussines logic.
controller.filter_post = async function (req, res) {
    urlPath = req.params.pathurl;

    let destination_service = services.map(getServiceInformation)[0];
    const uri = `${enviroment.gateway.url}:${destination_service.port}/${destination_service.path}`
    const options = {
        encoding: 'utf8',
        uri: uri,
        json: true,
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
        body: req.payload
    };

    try {
        delete req.params.pathurl;
        await request(options);
    } catch (error) {
        console.log(error);
        return response_management.custom_response(res, error.statusCode, new JsonFunctions().IsJsonString(error.error) ? JSON.parse(error.error) : error.error);
    }

    return response_management.custom_response(res, 200, 'pong');
}

function getServiceInformation(item) {
    if (item.origin_path === urlPath) {
        return {
            path: item.destination_path,
            port: item.port
        }
    }
}

module.exports = controller;