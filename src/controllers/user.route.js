const { Router } = require('express');
const { UserService } = require('../services/user.service');

const userRouter = Router();

userRouter.post('/signin', (req, res) => {
    const { email, plainPassword } = req.body;
    UserService.signIn(email, plainPassword)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

userRouter.post('/signup', (req, res) => {
    const { email, plainPassword, name } = req.body;
    UserService.signUp(email, plainPassword, name)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

userRouter.get('/check', (req, res) => {
    const { token } = req.headers;
    UserService.check(token)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

module.exports = { userRouter };
