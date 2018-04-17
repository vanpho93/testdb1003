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
    });

    it('Cannot update story with invalid id', async () => {
    });

    it('Cannot update a removed story', async () => {
    });
});
