const mongoose = require('mongoose');

const { Schema } = mongoose;

const storySchema = new Schema({
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story };
