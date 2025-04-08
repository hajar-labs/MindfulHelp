const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    bio: {
        type: String,
        default: '',
    },
    profilepic: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    },

    moodHistory: [{ date: Date, mood: String }],
    chatSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession' }],
}, { timestamps: true });


// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);