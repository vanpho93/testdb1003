const { Router } = require('express');
const { StoryService } = require('../services/story.service');
const { mustBeUser } = require('./mustBeUser.middleware');

const storyRouter = Router();

storyRouter.use(mustBeUser);

storyRouter.get('/', (req, res) => {
    StoryService.getAll()
    .then(stories => res.send({ success: true, stories }));
});

storyRouter.post('/', (req, res) => {
    const { content } = req.body;
    StoryService.createStory(req.idUser, content)
    .then(storyInfo => res.send({ success: true, story: storyInfo }))
    .catch(res.onError);
});

storyRouter.put('/:_id', (req, res) => {
    const { content } = req.body;
    StoryService.updateStory(req.idUser, req.params._id, content)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.delete('/:_id', (req, res) => {
    StoryService.removeStory(req.idUser, req.params._id)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.post('/like/:_id', (req, res) => {
    const { _id } = req.params;
    StoryService.likeStory(req.idUser, _id)
    .then(storyInfo => res.send({ success: true, story: storyInfo }))
    .catch(res.onError);
});

storyRouter.post('/dislike/:_id', (req, res) => {
    const { _id } = req.params;
    StoryService.dislikeStory(req.idUser, _id)
    .then(storyInfo => res.send({ success: true, story: storyInfo }))
    .catch(res.onError);
});

module.exports = { storyRouter };
