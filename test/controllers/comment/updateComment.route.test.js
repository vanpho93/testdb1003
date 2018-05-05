const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { Comment } = require('../../../src/models/comment.model');
const { UserService } = require('../../../src/services/user.service');
const { StoryService } = require('../../../src/services/story.service');
const { CommentService } = require('../../../src/services/comment.service');

describe.only('Test PUT /comment/:_id', () => {
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

    it('Can create new comment', async () => {
        const response = await request(app)
        .put('/comment/' + idComment)
        .set({ token: token2 })
        .send({ content: 'ghi' });
        const { status, body } = response;
        const { comment, success } = body;
        equal(success, true);
        equal(comment.content, 'ghi');
        const comment2 = await Comment.findById(idComment);
        equal(comment2.content, 'ghi');
    });

    it('Cannot update comment with invalid token', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app)
        .put('/comment/' + idComment)
        .set({ token: 'x' })
        .send({ content: 'x' });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 400);
        equal(message, 'INVALID_TOKEN');
        const comment2 = await Comment.findOne();
        equal(comment2.content, 'abc');
    });

    it('Cannot update comment with token 1', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app)
        .put('/comment/' + idComment)
        .set({ token: token1 })
        .send({ content: 'x' });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 404);
        equal(message, 'CANNOT_FIND_COMMENT');
        const comment2 = await Comment.findOne();
        equal(comment2.content, 'abc');
    });

    it('Cannot update comment with invalid comment id', async () => {
        await Story.findByIdAndRemove(idStory);
        const response = await request(app)
        .put('/comment/123')
        .set({ token: token2 })
        .send({ content: 'x' });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 400);
        equal(message, 'INVALID_ID');
        const comment2 = await Comment.findOne();
        equal(comment2.content, 'abc');
    });

    it('Cannot update comment with invalid comment id', async () => {
        await Comment.findByIdAndRemove(idComment);
        const response = await request(app)
        .put('/comment/' + idComment)
        .set({ token: token2 })
        .send({ content: 'x' });
        const { status, body } = response;
        const { comment, success, message } = body;
        equal(success, false);
        equal(comment, undefined);
        equal(status, 404);
        equal(message, 'CANNOT_FIND_COMMENT');
        const comment2 = await Comment.findOne();
        equal(comment2, null);
    });
});
