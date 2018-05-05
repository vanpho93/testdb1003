const { Story } = require('../models/story.model');
const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
const { MyError } = require('../models/my-error.model');
const { checkObjectId } = require('../helpers/checkObjectId');

class CommentService {
    static async createComment(idUser, idStory, content) {
        checkObjectId(idStory, idUser);
        if (!content) throw new MyError('INVALID_COMMENT', 400);
        const comment = new Comment({ author: idUser, content, story: idStory });
        const updateObj = { $push: { comments: comment._id } };
        const story = await Story.findByIdAndUpdate(idStory, updateObj);
        if (!story) throw new MyError('CANNOT_FIND_STORY', 404);
        await comment.save();
        return comment;
    }

    static async updateComment(idUser, _id, content) {
        checkObjectId(_id, idUser);
        const query = { _id, author: idUser };
        const comment = await Comment.findOneAndUpdate(query, { content }, { new: true });
        if (!comment) throw new MyError('CANNOT_FIND_COMMENT', 404);
        return comment;
    }

    static async removeComment(idUser, _id) {
        checkObjectId(_id, idUser);
        const query = { _id, author: idUser };
        const comment = await Comment.findOneAndRemove(query);
        if (!comment) throw new MyError('CANNOT_FIND_COMMENT', 404);
        await Story.findByIdAndUpdate(comment.story, { $pull: { comments: _id } });
        return comment;        
    }
}

module.exports = { CommentService };
