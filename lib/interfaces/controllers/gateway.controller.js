'use strict';

const request = require('request-promise');

const controller = {};
const response_management = require('../../application/protected/server/response.management');
const JsonFunctions = require('../../application/utils/json.functions');
const enviroment = require('../../infraestructure/config/enviroment');

const services = [
    { origin_path: "users/login", destination_url: "http://smssolutions-user", destination_path: "users/login", port: 3000 },
    { origin_path: "users", destination_url: "http://smssolutions-user", destination_path: "users", port: 3000 },
];
let urlPath;

// Filter controller, redirect to services bussines logic.
controller.filter = async function (req, res) {
    urlPath = req.params.entity + (req.params.pathurl ? `/${req.params.pathurl}` : "");

    let destination_service = services.filter(getServiceInformation)[0];
    const uri = `${destination_service.destination_url}:${destination_service.port}/${destination_service.destination_path}`;
    try {
        delete req.params.pathurl;
        return JSON.parse(await request(uri, req.params));
    } catch (error) {
        console.log(error);
        return response_management.custom_response(res, error.statusCode ?? 404, eval(error.error) ? error.error : new JsonFunctions().IsJsonString(error.error) ? JSON.parse(error.error) : JSON.parse(`{ "Message": "${error.error.toString()}" }`));
    }
}

// Filter controller, redirect to services bussines logic.
controller.filter_post = async function (req, res) {
    urlPath = req.params.entity + (req.params.pathurl ? `/${req.params.pathurl}` : "");

    let destination_service = services.filter(getServiceInformation)[0];
    const uri = `${destination_service.destination_url}:${destination_service.port}/${destination_service.destination_path}`

    console.log(`Uri: ${uri}`);
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
        return await request(options);
    } catch (error) {
        console.log(error);
        return response_management.custom_response(res, error.statusCode ?? 404, eval(error.error) ? error.error : new JsonFunctions().IsJsonString(error.error) ? JSON.parse(error.error) : JSON.parse(`{ "Message": "${error.error.toString()}" }`));
    }
}

function getServiceInformation(item) {
    if (item.origin_path === urlPath) {

        return item;
    }
}

module.exports = controller;