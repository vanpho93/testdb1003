const { Story } = require('../models/story.model');

class StoryService {
    static getAll() {
        return Story.find({});
    }

    static createStory(content) {
        const story = new Story({ content });
        return story.save();
    }
}

module.exports = { StoryService };
