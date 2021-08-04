const products = require('../routes/products');
const express = require('express');
const error = require('../middleware/error');

module.exports = function(app){
    // Middleware functions
    app.use(express.json());
    app.use('/uploads', express.static('uploads'))

    var bodyParser = require('body-parser');
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    // Routes Init
    app.use('/api/products', products);

    // Error Middleware
    app.use(error);

    // Content Security Policy
    app.use(function(req, res, next){
        res.setHeader("Content-Security-Policy", "default-src '*'; img-src data:");
    });
}