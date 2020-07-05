const { resolve } = require("path");
const express = require('express');
const serveStatic = require('serve-static');
const consoleTitle = require('console-title');
const { program } = require('commander');

const closeProcess = (...errors) => {
    const errorMessages = errors
        .filter(error => error)
        .map(error => error.message);

    if (errorMessages.length > 0) {
        console.error(...errorMessages);
        process.exit(1);
    }

    process.exit(0);
};

const createApp = (libPath) => {
    const app = express();
    const basePath = __dirname;

    app.use('/dist', serveStatic(resolve(basePath, 'dist')));
    app.use('/vendor', serveStatic(resolve(basePath, 'node_modules/stats-js/build')));
    app.use('/vendor', serveStatic(resolve(process.cwd(), libPath)));
    app.use('/examples', serveStatic(resolve(basePath, 'examples')));
    app.use('/', serveStatic(basePath, { index: 'index.html' }));

    return app;
}

const createServer = (app, port, host) => new Promise((resolve, reject) => {
    const server = app.listen(port, host, err => {
        if (err) {
            return reject(err);
        }

        const shutdown = () => server.close(err => closeProcess(err));

        process.on('SIGTERM', () => shutdown());
        process.on('SIGINT', () => shutdown());
        process.on('uncaughtException', () => shutdown());

        resolve(server);
    });
});

const { port, address, libPath } = program
    .option('-l, --lib-path [path]', 'ExoJS library path relative to current directory', 'node_modules/exo-js-core/dist')
    .option('-a, --address [hostname]', 'Server address', '127.0.0.1')
    .option('-p, --port [number]', 'Server port', (port) => parseInt(port, 10), 3000)
    .parse(process.argv);

(async () => {
    try {
        const app = createApp(libPath);
        const server = await createServer(app, port, address);
        const message = `App running: http://${address}:${port}`;

        consoleTitle(message);
        console.log(message);
    } catch (err) {
        if(err.code === 'EADDRINUSE') {
            closeProcess(new Error(`Port ${port} seems to be busy.`));
        } else {
            closeProcess(err);
        }
    }
})();