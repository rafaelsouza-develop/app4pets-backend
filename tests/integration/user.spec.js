const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('../../src/database/index')

describe('USER', () => {

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it(`create a new USER`, async ()=> {
        const response = await request(app)
        .post('/auth/register')
        .send({
                name: "Rafael Souza",
                email: "rafael2@rafael.com",
                password: "R@fael123"
            
        })
        expect(response.body.user).toHaveProperty('_id')
        expect(response.body.user._id).toHaveLength(24);
    });

    it(`create a new USER já existe`, async ()=> {
        const response = await request(app)
        .post('/auth/register')
        .send({
                name: "Rafael Souza",
                email: "rafael2@rafael.com",
                password: "R@fael123"
            
        })
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toEqual('Usuario já existe');
    });

    it(`create new session`, async () => {
        const response = await request(app)
        .post('/auth/authenticate')
        .send({
                email: "rafael2@rafael.com",
                password: "R@fael123"
            
        })
        expect(response.body).toHaveProperty('token')
        expect(response.body.user).toHaveProperty('_id')
        expect(response.body.user._id).toHaveLength(24);
    });

})