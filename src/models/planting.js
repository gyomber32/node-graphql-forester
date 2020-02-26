import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const plantingSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    species: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    survived: {
        type: Number,
        required: false,
        default: 0
    },
    planting_date: {
        type: Date,
        required: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Planting', plantingSchema);
