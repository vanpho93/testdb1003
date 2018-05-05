const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { UserService } = require('../../../src/services/user.service');
const { StoryService } = require('../../../src/services/story.service');

describe('Test POST /story/like/:_id', () => {
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
        const story = await StoryService.createStory(idUser1, 'xyz');
        idStory = story._id
    });

    it('Can like a story', async () => {
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { story, success } = body;
        equal(success, true);
        equal(story.fans[0], idUser2);
        const story2 = await Story.findById(idStory).populate('fans');
        equal(story2.fans[0].name, 'Ti Nguyen');
    });

    it('Cannot like a story with invalid idStory', async () => {
        const response = await request(app)
        .post('/story/like/' + 123)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { story, success, message } = body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_ID');
        equal(status, 400);
        const story2 = await Story.findById(idStory).populate('fans');
        equal(story2.fans.length, 0);
    });

    it('Cannot like a story without token', async () => {
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: '' })
        .send({});
        const { status, body } = response;
        const { story, success, message } = body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_TOKEN');
        equal(status, 400);
        const story2 = await Story.findById(idStory).populate('fans');
        equal(story2.fans.length, 0);
    });

    it('Cannot like a removed story', async () => {
        StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { story, success, message } = body;
        equal(success, false);
        equal(story, undefined);
        equal(status, 404);
        equal(message, 'CANNOT_FIND_STORY');
    });

    it('Can like a story twice', async () => {
        await request(app).post('/story/like/' + idStory).set({ token: token2 }).send({});
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { story, success, message } = body;
        equal(success, false);
        equal(status, 404);
        equal(story, undefined);
        equal(message, 'CANNOT_FIND_STORY');
    });
});
