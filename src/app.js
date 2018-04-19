const express = require('express');
const { json } = require('body-parser');
const { hash, compare } = require('bcrypt');
const { Story } = require('./models/story.model');
const { User } = require('./models/user.model');

const app = express();
app.use(json());

app.get('/story', (req, res) => {
    Story.find({})
    .then(stories => res.send({ success: true, stories }));
});

app.post('/story', (req, res) => {
    const { content } = req.body;
    const story = new Story({ content });
    story.save()
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
    let user;
    User.findOne({ email })
    .then(u => {
        if (!u) throw new Error('Cannot find user');
        user = u;
        return compare(plainPassword, u.password);
    })
    .then(same => {
        if (!same) throw new Error('Invalid password');
        return res.send({ success: true, user });
    })
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

app.post('/user/signup', (req, res) => {
    const { email, plainPassword, name } = req.body;
    hash(plainPassword, 8)
    .then(encryptedPassword => {
        const user = new User({ name, email, password: encryptedPassword });
        return user.save();
    })
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

module.exports = { app };
