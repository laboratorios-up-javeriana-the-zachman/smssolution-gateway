'use strict';

const router = {};

//Controllers import
const gateway_controller = require('../controllers/gateway.controller');

module.exports = {
    name: 'gateway',
    version: '1.0.0',
    register: async (server) => {
        server.route([
            {
                method: 'GET',
                path: '/smssolution/{entity}/{pathurl?}',
                handler: async (req, res) => {
                    return await gateway_controller.filter(req, res)
                },
                options: {
                    description: 'Method GET pass-true to the service filter',
                    tags: ['api']
                }
            },
            {
                method: ['POST', 'PUT'],
                path: '/smssolution/{entity}/{pathurl?}',
                handler: async (req, res) => {
                    return await gateway_controller.filter_post(req, res)
                },
                options: {
                    description: 'Method POST pass-true to the service filter',
                    tags: ['api']
                }
            },
            {
                method: ['POST'],
                path: '/smssolution/files/{entity}/{pathurl?}',
                handler: async (req, res) => {
                    return await gateway_controller.filter_post_files(req, res)
                },
                options: {
                    description: 'Method POST pass-true to the service filter',
                    tags: ['api'],
                    payload: {
                        output: 'file',
                        parse: true,
                        allow: ['application/octet-stream', 'multipart/form-data'],
                        maxBytes: 1024 * 1024 * 100,
                        timeout: false,
                        multipart: { output: "file" },
                        multipart: true
                    }
                }
            }
        ])
    }
};
