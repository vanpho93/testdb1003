const mongoose = require('mongoose');

const { Schema } = mongoose;

const storySchema = new Schema({
    content: { type: String, required: true, trim: true }
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story };
