require('dotenv').config({path: `${__dirname}/.env`});
require(`${__dirname}/api/models/db`);
const express = require('express');
const compression = require('compression');
const logger = require("morgan");
const apiRouter = require(`${__dirname}/api/routes/index`);

const app = express();

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.disable("x-powered-by");
app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', apiRouter);

module.exports = app;
