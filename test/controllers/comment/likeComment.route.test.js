const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { Comment } = require('../../../src/models/comment.model');
const { UserService } = require('../../../src/services/user.service');
const { StoryService } = require('../../../src/services/story.service');
const { CommentService } = require('../../../src/services/comment.service');

describe.only('Test POST /comment/like/:_id', () => {
    let token1, idUser1, token2, idUser2, idStory, idComment;

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
        const comment = await CommentService.createComment(idUser2, idStory, 'abc');
        idComment = comment._id;
    });

    it('Can like a comment', async () => {
        const response = await request(app)
        .post('/comment/like/' + idComment)
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { comment, success } = body;
        equal(success, true);
        equal(comment.fans[0], idUser1);
        const commentDb = await Comment.findById(idComment).populate('fans');
        equal(commentDb.fans[0].name, 'Teo Nguyen');
    });

    it('Cannot like a comment with invalid idStory', async () => {
        const response = await request(app)
        .post('/comment/like/' + 123)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { story, success, message } = body;
        equal(success, false);
        equal(story, undefined);
        equal(message, 'INVALID_ID');
        equal(status, 400);
        const commentDb = await Comment.findById(idComment).populate('fans');
        equal(commentDb.fans.length, 0);
    });

    it('Cannot like a comment without token', async () => {
        const response = await request(app)
        .post('/comment/like/' + idComment)
        .set({ token: '' })
        .send({});
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'INVALID_TOKEN');
        equal(status, 400);
        const commentDb = await Comment.findById(idComment).populate('fans');
        equal(commentDb.fans.length, 0);
    });

    it('Cannot like a removed comment', async () => {
        await CommentService.removeComment(idUser2, idComment);
        const response = await request(app)
        .post('/comment/like/' + idComment)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(status, 404);
        const commentDb = await Comment.findById(idComment).populate('fans');
        equal(commentDb, null);
    });

    it('Can like a story twice', async () => {
        await request(app).post('/comment/like/' + idComment).set({ token: token1 }).send({});
        const response = await request(app)
        .post('/comment/like/' + idComment)
        .set({ token: token1 })
        .send({});
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(status, 404);
        equal(comment, undefined);
        equal(message, 'CANNOT_FIND_COMMENT');
    });

    it('Cannot like a comment of a removed story', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .post('/comment/like/' + idComment)
        .set({ token: token2 })
        .send({});
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(status, 404);
        const commentDb = await Comment.findById(idComment).populate('fans');
        equal(commentDb, null);
    });
});
