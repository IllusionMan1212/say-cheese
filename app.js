require('dotenv').config({path: `${__dirname}/.env`});
require(`${__dirname}/api/models/db`);
const express = require('express');
const compression = require('compression');
const logger = require("morgan");
const ratelimiter = require("express-rate-limit");
const apiRouter = require(`${__dirname}/api/routes/index`);

const limit = ratelimiter({
    windowMs: 60 * 1000,
    max: 60,
    draft_polli_ratelimit_headers: true,
});

const app = express();

app.use(limit);
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.disable("x-powered-by");
app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if(req.method === 'OPTIONS')
        res.header('Allow', 'GET, OPTIONS');

    next();
});

app.use('/', apiRouter);

module.exports = app;
