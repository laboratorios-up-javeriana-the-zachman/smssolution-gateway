'use strict';

const request = require('request-promise');

const controller = {};
const response_management = require('../../application/protected/server/response.management');
const JsonFunctions = require('../../application/utils/json.functions');
const enviroment = require('../../infraestructure/config/enviroment');

const services = [
    { origin_path: "users/login", destination_url: "http://smssolutions-user", destination_path: "users/login", port: 3000 },
    { origin_path: "users", destination_url: "http://smssolutions-user", destination_path: "users", port: 3000 },
    { origin_path: "type-parameter", destination_url: "http://smssolutions-parameter", destination_path: "type", port: 3000 },
    { origin_path: "parameter", destination_url: "http://smssolutions-parameter", destination_path: "parameter", port: 3000 },
    { origin_path: "message/send", destination_url: "http://smssolutions-message", destination_path: "message/send", port: 3000 },
    { origin_path: "message/publish", destination_url: "http://smssolutions-message", destination_path: "message/publish", port: 3000 },
    { origin_path: "campaign", destination_url: "http://smssolutions-campaign", destination_path: "campaign", port: 3000 },
    { origin_path: "campaign/insert", destination_url: "http://smssolutions-campaign", destination_path: "campaign/insert", port: 3000 },
    { origin_path: "campaign/update", destination_url: "http://smssolutions-campaign", destination_path: "campaign/update", port: 3000 },
    { origin_path: "campaignParameter", destination_url: "http://smssolutions-campaign", destination_path: "campaignParameter", port: 3000 },
    { origin_path: "event", destination_url: "http://smssolutions-event", destination_path: "event", port: 3000 },
    { origin_path: "logphone", destination_url: "http://smssolutions-log", destination_path: "log", port: 3000 },
    { origin_path: "lograngedate", destination_url: "http://smssolutions-log", destination_path: "logRangeDate", port: 3000 },
    { origin_path: "logstate", destination_url: "http://smssolutions-log", destination_path: "logState", port: 3000 },
    { origin_path: "statemessage", destination_url: "http://smssolutions-campaign", destination_path: "state", port: 3000 },
    { origin_path: "message/extractLog", destination_url: "http://smssolutions-message", destination_path: "extractLog", port: 3000 },
    { origin_path: "campaign/uploadfile", destination_url: "http://localhost", destination_path: "campaign/uploadfile", port: 8185 },
    { origin_path: "extractLog", destination_url: "http://smssolutions-message", destination_path: "message/extractLog", port: 3000 },
    { origin_path: "dashboard", destination_url: "http://smssolutions-message", destination_path: "message/dashboard", port: 3000 },
    { origin_path: "dashboardDateMessage", destination_url: "http://smssolutions-message", destination_path: "message/dashboardDateMessage", port: 3000 },
    { origin_path: "message/sendMassive", destination_url: "http://smssolutions-message", destination_path: "message/sendMassive", port: 3000 }
];
let urlPath;

// Filter controller, redirect to services bussines logic.
controller.filter = async function (req, res) {
    urlPath = req.params.entity + (req.params.pathurl ? `/${req.params.pathurl}` : "");

    let destination_service = services.filter(getServiceInformation)[0];
    const uri = `${destination_service.destination_url}:${destination_service.port}/${destination_service.destination_path}`;
    try {
        delete req.params.pathurl;
        return JSON.parse(await request(uri, { params: req.params, qs: req.query }));
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


// Filter controller, redirect to services bussines logic.
controller.filter_post_files = async function (req, res) {
    urlPath = req.params.entity + (req.params.pathurl ? `/${req.params.pathurl}` : "");

    let destination_service = services.filter(getServiceInformation)[0];
    const uri = `${destination_service.destination_url}:${destination_service.port}/${destination_service.destination_path}`
    let data = [req.payload];
    console.log(`Uri: ${uri}`);
    const options = {
        uri: uri,
        allow: ['application/octet-stream', 'multipart/form-data'],
        maxBytes: 1024 * 1024 * 100,
        timeout: false,
        method: req.method,
        multipart: data
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