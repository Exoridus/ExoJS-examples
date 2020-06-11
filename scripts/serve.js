const { resolve } = require("path");
const express = require('express');
const serveStatic = require('serve-static');
const consoleTitle = require('console-title');
const { program } = require('commander');

const closeProcess = (...errors) => {
    const list = errors.filter(err => err);

    if (list.length > 0) {
        console.error(...list);
        process.exit(1);
    }

    process.exit(0);
};

const app = express();
const projectDir = resolve(__dirname, '..');
const { libPath, port, host } = program
    .option('-l, --lib-path [path]', 'ExoJS library path relative to current directory', 'node_modules/exo-js-core/dist')
    .option('-h, --host [hostname]', 'Server host', '127.0.0.1')
    .option('-p, --port [number]', 'Server port', (port) => parseInt(port, 10), 3000)
    .parse(process.argv);

app.use('/dist', serveStatic(resolve(projectDir, 'dist')));
app.use('/vendor', serveStatic(resolve(projectDir, 'node_modules/stats-js/build')));
app.use('/vendor', serveStatic(resolve(process.cwd(), libPath)));
app.use(serveStatic(resolve(projectDir, 'public'), { 'index': 'index.html' }));

const server = app.listen(port, host, () => {
    const { port, address } = server.address();
    const message = `App running: http://${address}:${port}`;

    consoleTitle(message);
    console.log(message);
}).on('error', (err) => {
    if(err.errno === 'EADDRINUSE') {
        closeProcess(`Port ${port} is busy.`);
    } else {
        closeProcess(err);
    }
});

const shutdown = () => server.close((err) => closeProcess(err));

process.on('SIGTERM', () => shutdown());
process.on('SIGINT', () => shutdown());