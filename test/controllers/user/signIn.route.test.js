const request = require('supertest');
const { equal } = require('assert');
const { compareSync } = require('bcrypt');
const { app } = require('../../../src/app');
const { User } = require('../../../src/models/user.model');
const { verify } = require('../../../src/helpers/jwt');

describe('Test POST /user/signin', () => {
    beforeEach('Sign up user for test', async () => {
        const body = {
            email: 'teo@gmail.com',
            plainPassword: '123',
            name: 'Teo Nguyen'
        }
        await request(app).post('/user/signup').send(body);
    });

    it('Can sign in', async () => {
        const body = {
            email: 'teo@gmail.com',
            plainPassword: '123'
        }
        const response = await request(app).post('/user/signin').send(body);
        // console.log(response.body);
        equal(response.body.success, true);
        const { name, email, password, token, _id } = response.body.user;
        equal(name, 'Teo Nguyen');
        equal(email, 'teo@gmail.com');
        equal(password, undefined);
        const obj = await verify(token)
        equal(_id, obj._id);
    });

    it('Cannot sign in with wrong email', async () => {
        const body = {
            email: 'x@gmail.com',
            plainPassword: '123'
        }
        const response = await request(app).post('/user/signin').send(body);
        equal(response.body.success, false);
        equal(response.body.user, undefined);
        equal(response.body.message, 'INVALID_USER_INFO');
        equal(response.status, 400);
    });

    it('Cannot sign in with wrong email', async () => {
        const body = {
            email: 'teo@gmail.com',
            plainPassword: 'xabcdx'
        }
        const response = await request(app).post('/user/signin').send(body);
        equal(response.body.success, false);
        equal(response.body.user, undefined);
        equal(response.body.message, 'INVALID_USER_INFO');
        equal(response.status, 400);
    });

    it('Cannot sign in without email', async () => {
        const body = {
            email: '',
            plainPassword: '123'
        }
        const response = await request(app).post('/user/signin').send(body);
        equal(response.body.success, false);
        equal(response.body.user, undefined);
        equal(response.body.message, 'INVALID_USER_INFO');
        equal(response.status, 400);
    });
});
