const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('../../src/database/index')

describe('PET', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    it(`create a new PET`, async ()=> {
        const response = await request(app)
        .post('/pet/create')
        .send({
                name: "Anubis",
                breed: "SRD",
                size: "Medio",
                genre: "MALE"
            
        })
        expect(response.body).toHaveProperty('_id')
        expect(response.body._id).toHaveLength(24);
    });


})