const { Router } = require('express');
const { FriendService } = require('../services/friend.service');
const { mustBeUser } = require('./mustBeUser.middleware');

const friendRouter = Router();

friendRouter.get('/', mustBeUser, (req, res) => {
    FriendService.getAllUsers(req.idUser)
    .then(people => res.send({ success: true, people }));
});

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

friendRouter.post('/decline/:idSender', mustBeUser, (req, res) => {
    FriendService.declineFriendRequest(req.idUser, req.params.idSender)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

friendRouter.delete('/request/:idReceiver', mustBeUser, (req, res) => {
    FriendService.removeFriendRequest(req.idUser, req.params.idReceiver)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

friendRouter.delete('/:idFriend', mustBeUser, (req, res) => {
    FriendService.removeFriend(req.idUser, req.params.idFriend)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

module.exports = { friendRouter };
