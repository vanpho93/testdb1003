const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { User } = require('../../../src/models/user.model');
const { UserService } = require('../../../src/services/user.service');

describe.only('Test POST /story', () => {
    let token, _id;
    beforeEach('Sign up user for test', async () => {
        await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        const user = await UserService.signIn('teo@gmail.com', '123');
        token = user.token;
        _id = user._id;
    });

    it('Can create new story', async () => {
        const response = await request(app)
        .post('/story')
        .set({ token })
        .send({ content: 'ABCD' });
        const { success, story } = response.body;
        equal(success, true);
        equal(story.content, 'ABCD');
        const storyDb = await Story.findOne({}).populate('author');
        
        equal(storyDb.content, 'ABCD');
        equal(storyDb._id, story._id);
        equal(storyDb.author._id.toString(), _id);
        equal(storyDb.author.name, 'Teo Nguyen');

        const user = await User.findById(_id).populate('stories');
        equal(user.stories[0]._id, story._id);
        equal(user.stories[0].content, 'ABCD');
    });

    it('Cannot create new story with empty content', async () => {
        const response = await request(app)
        .post('/story')
        .set({ token })
        .send({ content: '' });
        const { success, story, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'CONTENT_MUST_BE_PROVIDED');
        equal(story, undefined);
        const storyDb = await Story.findOne({});
        equal(storyDb, null);
    });

    it('Cannot create new story without token', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: 'ABCD' });
        const { success, story, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(story, undefined);
        const storyDb = await Story.findOne({});
        equal(storyDb, null);
    });
});
