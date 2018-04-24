const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
