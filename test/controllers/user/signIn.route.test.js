const request = require('supertest');
const { equal } = require('assert');
const { compareSync } = require('bcrypt');
const { app } = require('../../../src/app');
const { User } = require('../../../src/models/user.model');

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
        equal(response.body.success, true);
        equal(response.body.user.name, 'Teo Nguyen');
        equal(response.body.user.email, 'teo@gmail.com');
    });

    it('Cannot sign in with wrong email', async () => {
        const body = {
            email: 'x@gmail.com',
            plainPassword: '123'
        }
        const response = await request(app).post('/user/signin').send(body);
        equal(response.body.success, false);
        equal(response.body.user, undefined);
        equal(response.body.message, 'Cannot find user');
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
        equal(response.body.message, 'Invalid password');
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
        equal(response.body.message, 'Cannot find user');
        equal(response.status, 400);
    });
});
