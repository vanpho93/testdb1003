const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');

describe('Test DELETE /story/:_id', () => {
    let idStory;
    beforeEach('Create new story for test', async () => {
        const story = new Story({ content: 'abcd' });
        await story.save();
        idStory = story._id;
    });

    it('Can remove a story', async () => {
        const response = await request(app).delete('/story/' + idStory);
        const { success, story } = response.body;
        equal(success, true);
        equal(story.content, 'abcd');
        const storyDb = await Story.findOne({});
        equal(storyDb, null);
    });

    it('Cannot remove story with invalid id', async () => {
        const response = await request(app).delete('/story/abcd');
        const { success, story } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(response.status, 400);
        const storyDb = await Story.findOne({});
        equal(storyDb.content, 'abcd');
    });

    it('Cannot remove a removed story', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app).delete('/story/' + idStory);
        const { success, story, message } = response.body;
        equal(success, false);
        equal(story, undefined);
        equal(response.status, 400);
        equal(message, 'Cannot find story');
        const storyDb = await Story.findOne({});
        equal(storyDb, null);
    });
});
