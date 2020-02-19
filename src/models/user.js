import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);