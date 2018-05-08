const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../../src/app');
const { Story } = require('../../../src/models/story.model');
const { Comment } = require('../../../src/models/comment.model');
const { UserService } = require('../../../src/services/user.service');
const { StoryService } = require('../../../src/services/story.service');
const { CommentService } = require('../../../src/services/comment.service');

describe('Test DELETE /comment/:_id', () => {
    let token1, idUser1, token2, idUser2, idStory, idComment;

    beforeEach('Create new comment for test', async () => {
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

    it('Can remove a comment', async () => {
        const response = await request(app)
        .delete('/comment/' + idComment)
        .set({ token: token2 });
        const { comment, success } = response.body;
        equal(success, true);
        equal(comment._id, idComment);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb, null);
        const story = await Story.findById(idStory);
        equal(story.comments.length, 0);
    });

    it('Cannot remove comment with invalid id', async () => {
        const response = await request(app)
        .delete('/comment/' + 123)
        .set({ token: token2 });
        const { comment, success, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'INVALID_ID');
        equal(response.status, 400);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb.content, 'abc');
    });

    it('Cannot remove a removed comment', async () => {
        await CommentService.removeComment(idUser2, idComment);
        const response = await request(app)
        .delete('/comment/' + idComment)
        .set({ token: token2 });
        const { comment, success, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(response.status, 404);
    });

    it('Cannot remove comment without token', async () => {
        const response = await request(app)
        .delete('/comment/' + idComment);
        const { comment, success, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'INVALID_TOKEN');
        equal(response.status, 400);
    });

    it('Cannot remove comment with token 1', async () => {
        const response = await request(app)
        .delete('/comment/' + idComment)
        .set({ token: token1 });
        const { comment, success, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(response.status, 404);
    });

    it('Cannot remove of removed story', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .delete('/comment/' + idComment)
        .set({ token: token2 });
        const { comment, success, message } = response.body;
        equal(success, false);
        equal(comment, undefined);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(response.status, 404);
    });
});
