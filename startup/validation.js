const Joi = require('@hapi/joi');

module.exports = function(){
    Joi.ObjectId = require('joi-objectid')(Joi);
}