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

    static async updateStory(idUser, _id, content) {
        const query = { _id, author: idUser };
        const story = await Story.findOneAndUpdate(query, { content }, { new: true });
        if (!story) throw new Error('Cannot find story');
        return story;
    }

    static async removeStory(idUser, _id) {
        const query = { _id, author: idUser };
        const story = await Story.findOneAndRemove(query);
        if (!story) throw new Error('Cannot find story');
        return story;        
    }
}

module.exports = { StoryService };
