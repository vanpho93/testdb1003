const { Router } = require('express');
const { CommentService } = require('../services/comment.service');
const { mustBeUser } = require('./mustBeUser.middleware');

const commentRouter = Router();

commentRouter.use(mustBeUser);

commentRouter.post('/', (req, res) => {
    const { content, idStory } = req.body;
    CommentService.createComment(req.idUser, idStory, content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.put('/:_id', (req, res) => {
    const { content } = req.body;
    CommentService.updateComment(req.idUser, req.params._id, content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.delete('/:_id', (req, res) => {
    CommentService.removeComment(req.idUser, req.params._id)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.post('/like/:_id', (req, res) => {
    const { _id } = req.params;
    CommentService.likeComment(req.idUser, _id)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.post('/dislike/:_id', (req, res) => {
    const { _id } = req.params;
    CommentService.dislikeComment(req.idUser, _id)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

module.exports = { commentRouter };
