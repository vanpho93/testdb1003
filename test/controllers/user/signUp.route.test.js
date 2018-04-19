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
        const user = await User.findOne({});
        equal(user.name, 'Teo Nguyen');
        equal(user.email, 'teo@gmail.com');
        const same = compareSync('123', user.password);
        equal(same, true);
    });

    it('Cannot sign up without email', async () => {
        const body = {
            email: '',
            plainPassword: '123',
            name: 'Teo Nguyen'
        }
        const response = await request(app).post('/user/signup').send(body);
        equal(response.body.success, false);
        equal(response.status, 400);
        const user = await User.findOne({});
        equal(user, null);
    });

    it('Cannot sign up without name', async () => {
        const body = {
            email: 'teo@gmail.com',
            plainPassword: '123',
            name: ''
        }
        const response = await request(app).post('/user/signup').send(body);
        equal(response.body.success, false);
        equal(response.status, 400);
        const user = await User.findOne({});
        equal(user, null);
    });

    it('Cannot sign up twice with 1 email', async () => {
        const body = {
            email: 'teo@gmail.com',
            plainPassword: '',
            name: 'Teo Nguyen'
        }
        await request(app).post('/user/signup').send(body);
        const response = await request(app).post('/user/signup').send(body);
        equal(response.body.success, false);
        equal(response.status, 400);
        const userCount = await User.count({});
        equal(userCount, 1);
    });
});

