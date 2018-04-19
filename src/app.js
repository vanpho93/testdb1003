const express = require('express');
const { json } = require('body-parser');
const { Story } = require('./models/story.model');
const { storyRouter } = require('./controllers/story.route');
const { userRouter } = require('./controllers/user.route');

const app = express();
app.use(json());

app.use('/story', storyRouter);
app.use('/user', userRouter);

module.exports = { app };
