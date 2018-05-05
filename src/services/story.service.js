const { Story } = require('../models/story.model');
const { User } = require('../models/user.model');
const { MyError } = require('../models/my-error.model');
const { checkObjectId } = require('../helpers/checkObjectId');

class StoryService {
    static getAll() {
        return Story.find({});
    }

    static async createStory(idUser, content) {
        if (!content) throw new MyError('CONTENT_MUST_BE_PROVIDED', 400);
        const story = new Story({ content, author: idUser });
        await User.findByIdAndUpdate(idUser, { $push: { stories: story._id } });
        return story.save();
    }

    static async updateStory(idUser, _id, content) {
        checkObjectId(_id, idUser);
        const query = { _id, author: idUser };
        const story = await Story.findOneAndUpdate(query, { content }, { new: true });
        if (!story) throw new MyError('CANNOT_FIND_STORY', 404);
        return story;
    }

    static async removeStory(idUser, _id) {
        checkObjectId(_id, idUser);
        const query = { _id, author: idUser };
        const story = await Story.findOneAndRemove(query);
        if (!story) throw new MyError('CANNOT_FIND_STORY', 404);
        await User.findByIdAndUpdate(idUser, { $pull: { stories: _id } });
        return story;        
    }

    static async likeStory(idUser, _id) {
        checkObjectId(idUser, _id);
        const queryObject = { _id, fans: { $ne: idUser } };
        const story = await Story.findOneAndUpdate(queryObject, { $addToSet: { fans: idUser } }, { new: true });
        if (!story) throw new MyError('CANNOT_FIND_STORY', 404);
        return story;
    }

    static async dislikeStory(idUser, _id) {
        checkObjectId(idUser, _id);
        const queryObject = { _id, fans: { $eq: idUser } };
        const story = await Story.findOneAndUpdate(queryObject, { $pull: { fans: idUser } }, { new: true });
        if (!story) throw new MyError('CANNOT_FIND_STORY', 404);
        return story;
    }
}

module.exports = { StoryService };
