const request = require('supertest');
const {Product} = require('../../models/product');
let server;

describe('/api/products', () => {
    beforeEach(() => {server = require('../../index');});
    afterEach(async() => {
        await server.close();
        await Product.remove({});
    });
    
    describe('GET /', () => {
        it('should return all products', async() => {
            await Product.collection.insertMany([
                {name: 'prod1', price: '23', url: 'someUrl.com', productImage: './Color_Wheel.png'},
                {name: 'prod2', price: '16', url: 'someUrl.com', productImage: './Color_Wheel.png'}, 
            ]);

            const res = await request(server).get('/api/products');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(p => p.name === 'prod1')).toBeTruthy();
            expect(res.body.some(p => p.name === 'prod2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return product if valid id passed', async() => {
            const product = new Product({name: 'prod1', price: '23', url: 'someUrl.com', productImage: './Color_Wheel.png'});
            await product.save();

            const res = await request(server).get('/api/products/' + product._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', product.name);
        });

        it('should return 404 if invalid id is passed', async() => {
            const res = await request(server).get('/api/products/' + 1);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return 400 if the product is less than 5 characters', async() => {
            const res = await request(server)
                .post('/api/products')
                .send({name: '1234', price: '23', url: 'someUrl.com'});

            expect(res.status).toBe(400);
        });
        it('should return 400 if the product does not have the url', async() => {
            const res = await request(server)
                .post('/api/products')
                .send({name: '12345', price: '23'});

            expect(res.status).toBe(400);
        });
        it('should return 400 if the price of the product is less than 0', async() => {
            const res = await request(server)
                .post('/api/products')
                .send({name: '12345', price: '-3', url: 'someUrl.com'});

            expect(res.status).toBe(400);
        });
        it('should save the product if it is valid', async() => {
            const res = await request(server)
                .post('/api/products')
                .send({name: 'prod1', price: '234', url: 'someUrl.com', productImage: './Color_Wheel.png'});

            const product = await Product.find({name: 'prod1'})
            expect(product).not.toBeNull();
        });
        // it('should return the product if it is valid', async() => {
        //     const res = await request(server)
        //         .post('/api/products')
        //         .send({name: 'prod1', price: '24', url: 'someUrl.com'});

        //     expect(res.body).toHaveProperty('_id');
        //     expect(res.body).toHaveProperty('name', 'prod1');
        // });
    });
});