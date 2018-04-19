const express = require('express');
const { json } = require('body-parser');
const { Story } = require('./models/story.model');
const { UserService } = require('./services/user.service');
const { StoryService } = require('./services/story.service');

const app = express();
app.use(json());

app.get('/story', (req, res) => {
    StoryService.getAll()
    .then(stories => res.send({ success: true, stories }));
});

app.post('/story', (req, res) => {
    const { content } = req.body;
    StoryService.createStory(content)
    .then(storyInfo => res.send({ success: true, story: storyInfo }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.put('/story/:_id', (req, res) => {
    const { content } = req.body;
    Story.findByIdAndUpdate(req.params._id, { content }, { new: true })
    .then(story => {
        if (!story) throw new Error('Cannot find story');
        res.send({ success: true, story });
    })
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.delete('/story/:_id', (req, res) => {
    Story.findByIdAndRemove(req.params._id)
    .then(story => {
        if (!story) throw new Error('Cannot find story');
        res.send({ success: true, story });
    })
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.post('/user/signin', (req, res) => {
    const { email, plainPassword } = req.body;
    UserService.signIn(email, plainPassword)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.post('/user/signup', (req, res) => {
    const { email, plainPassword, name } = req.body;
    UserService.signUp(email, plainPassword, name)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

module.exports = { app };
