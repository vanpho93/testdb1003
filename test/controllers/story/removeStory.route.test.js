const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
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

    it('Can remove a story', async () => {
    });

    it('Cannot remove story with invalid id', async () => {
    });

    it('Cannot remove a removed story', async () => {
    });

    it('Cannot remove story without token', async () => {

    });

    it('Cannot remove story with token 2', async () => {

    });
});
