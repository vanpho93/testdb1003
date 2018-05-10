const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { User } = require('../../../src/models/user.model');
const { UserService } = require('../../../src/services/user.service');
const { FriendService } = require('../../../src/services/friend.service');

describe('Test POST /friend/decline/:idSender', () => {
    let token1, idUser1, token2, idUser2, idUser3, idStory;
    beforeEach('Create new users for test', async () => {
        await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        await UserService.signUp('ti@gmail.com', '123', 'Ti Nguyen');
        await UserService.signUp('tun@gmail.com', '123', 'Tun Nguyen');
        const user1 = await UserService.signIn('teo@gmail.com', '123');
        const user2 = await UserService.signIn('ti@gmail.com', '123');
        const user3 = await UserService.signIn('tun@gmail.com', '123');
        token1 = user1.token;
        idUser1 = user1._id;
        token2 = user2.token;
        idUser2 = user2._id;
        idUser3 = user3._id;
        await FriendService.addFriend(idUser1, idUser2);
    });

    it('Can decline friend request', async () => {
        const response = await request(app).
        post('/friend/decline/' + idUser1)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { success, user } = body;
        equal(status, 200);
        equal(success, true);
        equal(user._id, idUser1);
        equal(user.name, 'Teo Nguyen');
        const user1 = await User.findById(idUser1).populate('sentRequests').populate('friends');
        equal(user1.sentRequests.length, 0);
        equal(user1.friends.length, 0);
        const user2 = await User.findById(idUser2).populate('incommingRequests').populate('friends');
        equal(user2.incommingRequests.length, 0);
        equal(user2.friends.length, 0);
    });

    it('Cannot decline friend with invalid user id', async () => {
        const response = await request(app).
        post('/friend/decline/' + 123)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(user, null);
        equal(message, 'INVALID_ID');
        const user1 = await User.findById(idUser1).populate('sentRequests').populate('friends');
        equal(user1.sentRequests[0].name, 'Ti Nguyen');
        equal(user1.friends.length, 0);
        const user2 = await User.findById(idUser2).populate('incommingRequests').populate('friends');
        equal(user2.incommingRequests[0].name, 'Teo Nguyen');
        equal(user2.friends.length, 0);
    });

    it('Cannot decline friend without token', async () => {
        const response = await request(app).
        post('/friend/decline/' + idUser1)
        .set({ token: '' })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 400);
        equal(success, false);
        equal(user, null);
        equal(message, 'INVALID_TOKEN');
        const user1 = await User.findById(idUser1).populate('sentRequests').populate('friends');
        equal(user1.sentRequests[0].name, 'Ti Nguyen');
        equal(user1.friends.length, 0);
        const user2 = await User.findById(idUser2).populate('incommingRequests').populate('friends');
        equal(user2.incommingRequests[0].name, 'Teo Nguyen');
        equal(user2.friends.length, 0);
    });

    it('Cannot decline friend twice', async () => {
        await FriendService.declineFriendRequest(idUser2, idUser1);
        const response = await request(app).
        post('/friend/decline/' + idUser1)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, null);
        equal(message, 'CANNOT_FIND_USER');
        const user1 = await User.findById(idUser1).populate('sentRequests').populate('friends');
        equal(user1.sentRequests.length, 0);
        equal(user1.friends.length, 0);
        const user2 = await User.findById(idUser2).populate('incommingRequests').populate('friends');
        equal(user2.incommingRequests.length, 0);
        equal(user2.friends.length, 0);
    });

    it('Cannot decline friend with user who didnt send request for you', async () => {
        const response = await request(app).
        post('/friend/decline/' + idUser3)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
    });

    it('Cannot decline youself', async () => {
        const response = await request(app).
        post('/friend/decline/' + idUser2)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
    });

    it('Cannot accept friend with removed user', async () => {
        await User.findByIdAndRemove(idUser1);
        const response = await request(app).
        post('/friend/accept/' + idUser1)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { success, user, message } = body;
        equal(status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
    });
});
