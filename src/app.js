const express = require('express');
const { json } = require('body-parser');
const { Story } = require('./models/story.model');
const { storyRouter } = require('./controllers/story.route');
const { commentRouter } = require('./controllers/comment.route');
const { userRouter } = require('./controllers/user.route');
const { friendRouter } = require('./controllers/friend.route');

const app = express();

app.use(json());

app.use((req, res, next) => {
    res.onError = function(error) {
        const body = { success: false, message: error.message };
        if (!error.statusCode) console.log(error);
        res.status(error.statusCode || 500).send(body);
    };
    next();
});

app.use('/comment', commentRouter);
app.use('/story', storyRouter);
app.use('/user', userRouter);
app.use('/friend', friendRouter);

module.exports = { app };
