var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/api_v1');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/api/v1', apiRouter);

module.exports = app;