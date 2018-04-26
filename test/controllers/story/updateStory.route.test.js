const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { UserService } = require('../../../src/services/user.service');
const { StoryService } = require('../../../src/services/story.service');

describe.only('Test PUT /story/:_id', () => {
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

    it('Can update a story', async () => {
        const response = await request(app)
        .put('/story/' + idStory)
        .set({ token: token1 })
        .send({ content: 'AAA' });
        equal(response.body.success, true);
        equal(response.body.story.content, 'AAA');
        const story = await Story.findOne({});
        equal(story.content, 'AAA');
    });

    it('Cannot update story with invalid id', async () => {
        const response = await request(app)
        .put('/story/xyz')
        .set({ token: token1 })
        .send({ content: 'AAA' });
        equal(response.body.success, false);
        equal(response.body.message, 'INVALID_ID');
        equal(response.status, 400);
        const story = await Story.findOne({});
        equal(story.content, 'xyz');
    });

    it('Cannot update a removed story', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app)
        .put('/story/' + idStory)
        .set({ token: token1 })
        .send({ content: 'AAA' });
        equal(response.body.success, false);
        equal(response.body.message, 'CANNOT_FIND_STORY');
        equal(response.status, 404);
        const story = await Story.findOne({});
        equal(story, null);
    });

    it('Cannot update a story with token2', async () => {
        const response = await request(app)
        .put('/story/' + idStory)
        .set({ token: token2 })
        .send({ content: 'AAA' });
        equal(response.body.success, false);
        equal(response.body.story, undefined);
        equal(response.body.message, 'CANNOT_FIND_STORY');
        equal(response.status, 404);
        const story = await Story.findOne({});
        equal(story.content, 'xyz');
    });

    it('Cannot update a story without token', async () => {
        const response = await request(app)
        .put('/story/' + idStory)
        .send({ content: 'AAA' });
        equal(response.body.success, false);
        equal(response.body.message, 'INVALID_TOKEN');
        equal(response.status, 400);
        const story = await Story.findOne({});
        equal(story.content, 'xyz');
    });
});
