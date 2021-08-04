require('express-async-errors');
const logger = require('../logger/logger');
const winston = require('winston');

module.exports = function(){
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message, ex, function(){process.exit(1)});
    });
    
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}