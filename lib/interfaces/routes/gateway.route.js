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
            }
        ])
    }
};
