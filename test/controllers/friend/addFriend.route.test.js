const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { User } = require('../../../src/models/user.model');
const { UserService } = require('../../../src/services/user.service');
const { FriendService } = require('../../../src/services/friend.service');

describe('Test POST /friend/add/:idReceiver', () => {
    let token1, idUser1, token2, idUser2, idStory;
    beforeEach('Create new story for test', async () => {
        await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        await UserService.signUp('ti@gmail.com', '123', 'Ti Nguyen');
        const user1 = await UserService.signIn('teo@gmail.com', '123');
        const user2 = await UserService.signIn('ti@gmail.com', '123');
        token1 = user1.token;
        idUser1 = user1._id;
        token2 = user2.token;
        idUser2 = user2._id;
    });

    it('Can add friend', async () => {
        const response = await request(app).
        post('/friend/add/' + idUser2)
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { success, user } = body;
        equal(status, 200);
        equal(success, true);
        equal(user._id, idUser2);
        equal(user.name, 'Ti Nguyen');
        const user1 = await User.findById(idUser1).populate('sentRequests');
        equal(user1.sentRequests[0]._id.toString(), idUser2);
        equal(user1.sentRequests[0].name, 'Ti Nguyen');
        const user2 = await User.findById(idUser2).populate('incommingRequests');
        equal(user2.incommingRequests[0]._id.toString(), idUser1);
        equal(user2.incommingRequests[0].name, 'Teo Nguyen');
    });

    it('Cannot add friend with invalid user id', async () => {
        const response = await request(app).
        post('/friend/add/123')
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_ID');
        const user1 = await User.findById(idUser1).populate('sentRequests');
        equal(user1.sentRequests.length, 0);
        const user2 = await User.findById(idUser2).populate('incommingRequests');
        equal(user2.incommingRequests.length, 0);
    });

    it('Cannot add friend without token', async () => {
        const response = await request(app).
        post('/friend/add/' + idUser2)
        .set({ token: '' })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_TOKEN');
        const user1 = await User.findById(idUser1).populate('sentRequests');
        equal(user1.sentRequests.length, 0);
        const user2 = await User.findById(idUser2).populate('incommingRequests');
        equal(user2.incommingRequests.length, 0);
    });

    it('Cannot add friend twice', async () => {
        await FriendService.addFriend(idUser1, idUser2);
        const response = await request(app).
        post('/friend/add/' + idUser2)
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
        const user1 = await User.findById(idUser1).populate('sentRequests');
        equal(user1.sentRequests.length, 1);
        const user2 = await User.findById(idUser2).populate('incommingRequests');
        equal(user2.incommingRequests.length, 1);
    });

    it('Cannot add friend with user who sent request for you', async () => {
        await FriendService.addFriend(idUser2, idUser1);
        const response = await request(app).
        post('/friend/add/' + idUser2)
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
        const user1 = await User.findById(idUser1).populate('incommingRequests');
        equal(user1.incommingRequests.length, 1);
        const user2 = await User.findById(idUser2).populate('sentRequests');
        equal(user2.sentRequests.length, 1);
    });

    it('Cannot add friend youself', async () => {
        const response = await request(app).
        post('/friend/add/' + idUser1)
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
        const user1 = await User.findById(idUser1);
        equal(user1.sentRequests.length, 0);
        equal(user1.incommingRequests.length, 0);
    });

    it('Cannot add friend with removed user', async () => {
        await User.findByIdAndRemove(idUser2);
        const response = await request(app).
        post('/friend/add/' + idUser2)
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
        const user1 = await User.findById(idUser1).populate('incommingRequests');
        equal(user1.incommingRequests.length, 0);
        const user2 = await User.findById(idUser2).populate('sentRequests');
        equal(user2, null);
    });
});
