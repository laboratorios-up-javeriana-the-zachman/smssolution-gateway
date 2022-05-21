'use strict';

const router = {};

//Controllers import
const ping_controller = require('../controllers/ping.controller');

module.exports = {
    name: 'ping',
    version: '1.0.0',
    register: async (server) => {
        server.route([
            {
                method: 'GET',
                path: '/ping',
                handler: async (req, res) => {
                    return await ping_controller.ping(res)
                },
                options: {
                    description: 'Ping method to check if the server is running',
                    tags: ['api']
                }
            }
        ])
    }
};
