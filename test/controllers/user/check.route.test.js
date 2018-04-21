const request = require('supertest');
const { equal } = require('assert');
const { compareSync } = require('bcrypt');
const { app } = require('../../../src/app');
const { User } = require('../../../src/models/user.model');
const { UserService } = require('../../../src/services/user.service');
const { verify } = require('../../../src/helpers/jwt');

describe('Test GET /user/check', () => {
    let token, _id;
    beforeEach('Sign up user for test', async () => {
        await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        const user = await UserService.signIn('teo@gmail.com', '123');
        token = user.token;
        _id = user._id;
    });

    it.only('Can login with token', async () => {
        const response = await request(app).get('/user/check').set({ token });
        console.log(response.body);
    });

    xit('Can login without token', async () => {
        const response = await request(app).get('/user/check').set({ token });
        console.log(response.body);
    });

    xit('Can login with empty token', async () => {
        const response = await request(app).get('/user/check').set({ token });
        console.log(response.body);
    });

    xit('Can login with token for removed user', async () => {
        const response = await request(app).get('/user/check').set({ token });
        console.log(response.body);
    });
});
