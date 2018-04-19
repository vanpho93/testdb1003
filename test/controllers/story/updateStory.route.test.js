const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');

describe('Test PUT /story/:_id', () => {
    let idStory;
    beforeEach('Create new story for test', async () => {
        const story = new Story({ content: 'abcd' });
        await story.save();
        idStory = story._id;
    });

    it('Can update a story', async () => {
        const response = await request(app)
        .put('/story/' + idStory)
        .send({ content: 'AAA' });
        equal(response.body.success, true);
        equal(response.body.story.content, 'AAA');
        const story = await Story.findOne({});
        equal(story.content, 'AAA');
    });

    it('Cannot update story with invalid id', async () => {
        const response = await request(app)
        .put('/story/xyz')
        .send({ content: 'AAA' });
        equal(response.body.success, false);
        equal(response.status, 400);
        const story = await Story.findOne({});
        equal(story.content, 'abcd');
    });

    it('Cannot update a removed story', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app)
        .put('/story/' + idStory)
        .send({ content: 'AAA' });
        equal(response.body.success, false);
        equal(response.status, 400);
        const story = await Story.findOne({});
        equal(story, null);
    });
});
