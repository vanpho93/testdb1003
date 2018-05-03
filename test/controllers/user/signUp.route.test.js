const request = require('supertest');
const { equal } = require('assert');
const { compareSync } = require('bcrypt');
const { app } = require('../../../src/app');
const { User } = require('../../../src/models/user.model');

describe('Test POST /user/signup', () => {
    it('Can sign up', async () => {
        const body = {
            email: 'teo@gmail.com',
            plainPassword: '123',
            name: 'Teo Nguyen'
        }
        const response = await request(app).post('/user/signup').send(body);
        equal(response.body.success, true);
        equal(response.body.user.name, 'Teo Nguyen');
        equal(response.body.user.email, 'teo@gmail.com');
        equal(response.body.user.password, undefined);
        const user = await User.findOne({});
        equal(user.name, 'Teo Nguyen');
        equal(user.email, 'teo@gmail.com');
        const same = compareSync('123', user.password);
        equal(same, true);
    });

    it('Can sign without password', async () => {
        const reqquestBody = {
            email: 'teo@gmail.com',
            name: 'Teo Nguyen'
        }
        const response = await request(app).post('/user/signup').send(reqquestBody);
        const { status, body } = response;
        const { user, success, message } = body;
        equal(status, 400);
        equal(user, undefined);
        equal(message, 'INVALID_PASSWORD');
    });

    it('Cannot sign up without email', async () => {
        const requestBody = {
            email: '',
            plainPassword: '123',
            name: 'Teo Nguyen'
        }
        const response = await request(app).post('/user/signup').send(requestBody);
        const { status, body } = response;
        const { user, success, message } = body;
        equal(status, 400);
        equal(user, undefined);
        equal(message, 'INVALID_USER_INFO');
    });

    it('Cannot sign up without name', async () => {
        const requestBody = {
            email: 'teo@gmail.com',
            plainPassword: '123',
            name: ''
        }
        const response = await request(app).post('/user/signup').send(requestBody);
        const { status, body } = response;
        const { user, success, message } = body;
        equal(status, 400);
        equal(user, undefined);
        equal(message, 'INVALID_USER_INFO');
    });

    it('Cannot sign up twice with 1 email', async () => {
        const requestBody = {
            email: 'teo@gmail.com',
            plainPassword: '123',
            name: 'Teo Nguyen'
        }
        await request(app).post('/user/signup').send(requestBody);
        const response = await request(app).post('/user/signup').send(requestBody);
        const { status, body } = response;
        const { user, success, message } = body;
        equal(status, 400);
        equal(user, undefined);
        equal(message, 'EMAIL_EXISTED');
    });
});

