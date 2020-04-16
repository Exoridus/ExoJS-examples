const { PORT = 3000 } = process.env;
const path = require("path");
const express = require('express');
const serveStatic = require('serve-static');
const setTitle = require('console-title');

const app = express();
const projectRoot = process.cwd();

app.use('/dist', serveStatic(path.resolve(projectRoot, 'dist')));
app.use('/node_modules', serveStatic(path.resolve(projectRoot, 'node_modules')));
app.use(serveStatic(path.resolve(projectRoot, 'public'), { 'index': 'index.html' }));

app.listen(PORT, () => {
    const title = `App running: http://localhost:${PORT}`;

    setTitle(title);
    console.log(title);
});