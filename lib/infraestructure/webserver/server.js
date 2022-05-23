const Hapi = require("@hapi/hapi");
const Good = require("@hapi/good");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Blipp = require("blipp");
const HapiSwagger = require("hapi-swagger");

const enviroment = require("../config/enviroment");
const authentication_middleware = require('../../application/protected/middleware/authentication.middleware');

const createServer = async () => {

    // Create a server with a host and port
    const server = Hapi.server({
        port: enviroment.server.port,
    });

    // Register vendors plugins
    await server.register([
        Blipp,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: enviroment.server.title,
                    version: enviroment.server.version
                },
                documentationPage: true,
                swaggerUI: true,
                swaggerUIPath: '/swagger.json',
                securityDefinitions: {
                    jwt: {
                        type: 'apiKey',
                        name: 'Authorization',
                        scheme: 'bearer',
                        in: 'header',
                    }
                },
                security: [{
                    jwt: []
                }],
                swagger: "2.0",
                auth: false
            }
        },
        {
            plugin: Good,
            options: {
                ops: {
                    interval: 1000 * 60,
                },
                reporters: {
                    consoleReporter: [
                        {
                            module: "@hapi/good-squeeze",
                            name: "Squeeze",
                            args: [{ ops: "*", log: "*", error: "*", response: "*" }],
                        },
                        {
                            module: "@hapi/good-console",
                        },
                        "stdout",
                    ],
                },
            },
        },
    ]);

    // Register custom plugins
    await server.register([
        require('../../interfaces/routes/ping.route'),
        require('../../interfaces/routes/gateway.route')
    ]);

    await server.ext('onRequest', async (request, response) => {
        if (request.path != '/documentation' && request.path != '/ping' && 
        request.path != '/smssolution/users/login' && 
        request.path != '/smssolution/message/send' && !(request.path.startsWith('/swagger')
        ))
            return authentication_middleware.authenticated(request, response)
        return response.continue
    });

    return server;
}

module.exports = createServer;