import { Schema, model, Document } from 'mongoose';

const TreeSchema = new Schema({
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

interface ITree extends Document {
    _id: string;
    species: string;
    plantedQuantity: number;
    survivedQuantity: number;
    datePlanted: string;
    location: string;
    pictureId: string;
};

export default model<ITree>('trees', TreeSchema);
