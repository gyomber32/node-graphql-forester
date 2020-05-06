import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const seedSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    species: {
        type: String,
        required: true
    },
    seededQuantity: {
        type: Number,
        required: true
    },
    brairdedQuantity: {
        type: Number,
        required: false,
        default: 0
    },
    dateSeeded: {
        type: Date,
        required: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Seed', seedSchema);
