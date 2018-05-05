const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };
