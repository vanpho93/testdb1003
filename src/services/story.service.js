const { Story } = require('../models/story.model');
const { User } = require('../models/user.model');

class StoryService {
    static getAll() {
        return Story.find({});
    }

    static async createStory(idUser, content) {
        const story = new Story({ content, author: idUser });
        await User.findByIdAndUpdate(idUser, { $push: { stories: story._id } });
        return story.save();
    }

    static async updateStory(_id, content) {
        const story = await Story.findByIdAndUpdate(_id, { content }, { new: true });
        if (!story) throw new Error('Cannot find story');
        return story;        
    }

    static async removeStory(_id, content) {
        const story = await Story.findByIdAndRemove(_id);
        if (!story) throw new Error('Cannot find story');
        return story;        
    }
}

module.exports = { StoryService };
