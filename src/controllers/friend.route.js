const { Router } = require('express');
const { FriendService } = require('../services/friend.service');
const { mustBeUser } = require('./mustBeUser.middleware');

const friendRouter = Router();

friendRouter.post('/add/:idReceiver', mustBeUser, (req, res) => {
    FriendService.addFriend(req.idUser, req.params.idReceiver)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

friendRouter.post('/accept/:idSender', mustBeUser, (req, res) => {
    FriendService.acceptFriendRequest(req.idUser, req.params.idSender)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

module.exports = { friendRouter };
