const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    productImage: {
        data: Buffer,
        type: String
    },
    description: {
        type: String
    },
    currencySymbol:{
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: undefined
    }
});

productSchema.index({"expireAt": 1}, {expireAfterSeconds: 0});

const Product = mongoose.model('Product', productSchema);

function validateProduct(product){
    const schema = {
        name: Joi.string().min(1).max(512).required(),
        price: Joi.number().min(0).required(),
        salePrice: Joi.number(),
        category: Joi.string().required(),
        url: Joi.string().required(),
        description: Joi.string(),
        currencySymbol: Joi.string().required()
    }

    return Joi.validate(product, schema);
}
// productImage: Joi.string(),

exports.Product = Product;
exports.validate = validateProduct;