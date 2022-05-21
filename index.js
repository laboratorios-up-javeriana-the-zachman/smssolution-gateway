'use strict';

//Declaration dependencies modules
const createServer = require('./lib/infraestructure/webserver/server');

// Start the server
const start = async () => {

    try {
        const server = await createServer();
        await server.start();

        console.log('Server running at:', server.info.uri);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();