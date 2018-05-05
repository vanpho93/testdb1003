const { Story } = require('../models/story.model');
const { User } = require('../models/user.model');
const { Comment } = require('../models/comment.model');
const { MyError } = require('../models/my-error.model');
const { checkObjectId } = require('../helpers/checkObjectId');

class CommentService {}

module.exports = { CommentService };
