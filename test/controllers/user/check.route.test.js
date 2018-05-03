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

    it('Can login with token', async () => {
        const response = await request(app).get('/user/check').set({ token });
        // console.log(response.body);
        equal(response.body.success, true);
        const { name, email, password } = response.body.user;
        equal(name, 'Teo Nguyen');
        equal(email, 'teo@gmail.com');
        equal(password, undefined);
        const obj = await verify(response.body.user.token)
        equal(_id, obj._id);
    });

    it('Cannot login without token', async () => {
        const response = await request(app).get('/user/check');
        equal(response.body.success, false);
        equal(response.body.message, 'INVALID_TOKEN');
        equal(response.status, 400);
    });

    it('Can login with empty token', async () => {
        const response = await request(app).get('/user/check').set({ token: '' });
        equal(response.body.success, false);
        equal(response.body.message, 'INVALID_TOKEN');
        equal(response.status, 400);
    });

    it('Can login with token for removed user', async () => {
        await User.findByIdAndRemove(_id);
        const response = await request(app).get('/user/check').set({ token });
        equal(response.body.success, false);
        equal(response.body.message, 'CANNOT_FIND_USER');
        equal(response.status, 404);
    });
});
