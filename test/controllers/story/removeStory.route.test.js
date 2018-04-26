const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { User } = require('../../../src/models/user.model');
const { UserService } = require('../../../src/services/user.service');
const { StoryService } = require('../../../src/services/story.service');

describe.only('Test DELETE /story/:_id', () => {
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

    it.only('Can remove a story', async () => {
        const response = await request(app)
        .delete('/story/' + idStory)
        .set({ token: token1 });
        const { story, success } = response.body;
        equal(success, true);
        equal(story._id, idStory);
        equal(story.content, 'xyz');
        const storyDb = await Story.findById(idStory);
        equal(storyDb, null);
        const user = await User.findById(idUser1);
        equal(user.stories.length, 0);
    });

    it('Cannot remove story with invalid id', async () => {
        const response = await request(app)
        .delete('/story/' + 123)
        .set({ token: token1 });
        const { story, success } = response.body;
        equal(success, false);
        const storyDb = await Story.findById(idStory);
        equal(storyDb._id.toString(), idStory);
    });

    it('Cannot remove a removed story', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .delete('/story/' + idStory)
        .set({ token: token1 });
        const { story, success } = response.body;
        equal(success, false);
    });

    it('Cannot remove story without token', async () => {
        const response = await request(app)
        .delete('/story/' + idStory)
        const { story, success } = response.body;
        equal(success, false);
    });

    it('Cannot remove story with token 2', async () => {
        const response = await request(app)
        .delete('/story/' + idStory)
        .set({ token: token2 });
        const { story, success } = response.body;
        equal(success, false);
    });
});
