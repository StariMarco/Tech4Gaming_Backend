const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const upload = require('../startup/multerStorage');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'tech4gamingdeals',
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const {Product, validate} = require('../models/product');

// GET
router.get('/', async(req, res) => {
    const products = await Product.find().sort('-date');
    res.send(products);
});

router.get('/:id', validateObjectId, async(req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product) res.status(404).send('Cannot find this product');
    res.send(product);
});

router.get('/category/search/:category/:name', async(req, res) => {
    var expression = ".*" + (req.params.name) + ".*";
    var rx = new RegExp(expression, 'i');

    const products = await Product.find({category: req.params.category, name : { $regex: rx}}).sort('-date');
    if(!products) res.status(404).send('Cannot find products of this category');
    res.send(products);
});

router.get('/category/:name', async(req, res) => {
    const products = await Product.find({category: req.params.name}).sort('-date');
    if(!products) res.status(404).send('Cannot find products of this category');
    res.send(products);
});

router.get('/category/:name/:skip/:limit', async(req, res) => {
    const products = await Product.find({category: req.params.name})
                                  .skip(parseInt(req.params.skip))
                                  .limit(parseInt(req.params.limit))
                                  .sort('-date');
    if(!products) res.status(404).send('Cannot find products of this category');
    res.send(products);
});

router.get('/category/:name/:skip/:limit/:currency', async(req, res) => {
    let currencyStr = req.params.currency;
    if(currencyStr.charAt(2) === "e")
        currencyStr = currencyStr.replaceAt(2, "€");
    
    const products = await Product.find({category: req.params.name})
                                  .or([{currencySymbol: currencyStr.charAt(0)},{currencySymbol: currencyStr.charAt(1)},{currencySymbol: currencyStr.charAt(2)}])
                                  .skip(parseInt(req.params.skip))
                                  .limit(parseInt(req.params.limit))
                                  .sort('-date');
    if(!products) res.status(404).send('Cannot find products of this category');
    res.send(products);
});

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

router.get('/:skip/:limit', async(req, res) => {
    const products = await Product.find()
                                  .skip(parseInt(req.params.skip))
                                  .limit(parseInt(req.params.limit))
                                  .sort('-date');
    res.send(products);
});

// POST
router.post('/', upload.single('productImage'), async(req, res) => {

    console.log(req.body.expireAt);
    var expireDate = new Date(req.body.expireAt);
    var unixDate = Math.floor(expireDate.valueOf() / 1000);

    cloudinary.v2.uploader.upload(req.file.path, async(error, result) => {
        if(error) req.status(500).send('Internal error, cannot upload image');
        else{
            let product = new Product({
                name: req.body.name,
                price: req.body.price,
                salePrice: req.body.salePrice,
                date: req.body.date,
                category: req.body.category,
                url: req.body.url,
                productImage: result.secure_url,
                description: req.body.description,
                currencySymbol: req.body.currencySymbol,
                expireAt: expireDate
            });
            
            product = await product.save();
            res.send(product);
        }
    });
});

// PUT
router.put('/:id', async(req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        price: req.body.price,
        salePrice: req.body.salePrice,
        category: req.body.category,
        url: req.body.url,
        description: req.body.description
    }, {new: true});

    if(!product) return res.status(404).send('Cannot find this product');

    res.send(product);
});

// DELETE
router.delete('/:id', async(req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) res.status(404).send('Cannot find this product');
    else{
        var imageId = product.productImage.substring(69).split(".")[0];
        
        cloudinary.v2.uploader.destroy(imageId, function(error, result){
            console.log(error, result);
        });
    }
    res.send(product);
});

module.exports = router;