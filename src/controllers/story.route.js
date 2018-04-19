const { Router } = require('express');
const { StoryService } = require('../services/story.service');

const storyRouter = Router();

storyRouter.get('/', (req, res) => {
    StoryService.getAll()
    .then(stories => res.send({ success: true, stories }));
});

storyRouter.post('/', (req, res) => {
    const { content } = req.body;
    StoryService.createStory(content)
    .then(storyInfo => res.send({ success: true, story: storyInfo }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

storyRouter.put('/:_id', (req, res) => {
    const { content } = req.body;
    StoryService.updateStory(req.params._id, content)
    .then(story => res.send({ success: true, story }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

storyRouter.delete('/:_id', (req, res) => {
    StoryService.removeStory(req.params._id)
    .then(story => res.send({ success: true, story }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});

module.exports = { storyRouter };
