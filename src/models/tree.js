import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const treeSchema = new Schema({
    _id: mongoose.Schema.ObjectId,
    species: {
        type: String,
        required: true
    },
    plantedQuantity: {
        type: Number,
        required: true
    },
    survivedQuantity: {
        type: Number,
        required: false,
        default: 0
    },
    datePlanted: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    pictureId: {
        type: String,
        required: false
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('trees', treeSchema);
