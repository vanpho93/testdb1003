const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { Comment } = require('../../../src/models/comment.model');
const { UserService } = require('../../../src/services/user.service');
const { StoryService } = require('../../../src/services/story.service');
const { CommentService } = require('../../../src/services/comment.service');

describe('Test POST /comment', () => {
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

    it('Can create new comment', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ content: 'abcd', idStory });
        const { status, body } = response;
        const { comment, success } = body;
        equal(success, true);
        const comment2 = await Comment.findById(comment._id).populate('author');
        equal(comment2.content, 'abcd');
        equal(comment2.author.name, 'Ti Nguyen');
    });

    it('Cannot create new comment without content', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ idStory });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 400);
        equal(message, 'INVALID_COMMENT');
        const comment2 = await Comment.findOne().populate('author');
        equal(comment2, null);
    });

    it('Cannot create new comment with invalid idStory', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ content: 'x', idStory: '123' });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 400);
        equal(message, 'INVALID_ID');
        const comment2 = await Comment.findOne().populate('author');
        equal(comment2, null);
    });

    it('Cannot create new comment with invalid token', async () => {
        const response = await request(app)
        .post('/comment')
        .set({ token: '' })
        .send({ content: 'x', idStory });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 400);
        equal(message, 'INVALID_TOKEN');
        const comment2 = await Comment.findOne().populate('author');
        equal(comment2, null);
    });

    it('Cannot create new comment with invalid token', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app)
        .post('/comment')
        .set({ token: token2 })
        .send({ content: 'x', idStory });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 404);
        equal(message, 'CANNOT_FIND_STORY');
        const story = await Story.findOne().populate('author');
        const comment2 = await Comment.findOne().populate('author');
        equal(comment2, null);
        equal(story, null);
    });
});
