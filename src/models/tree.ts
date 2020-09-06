import { Schema, model } from 'mongoose';
import ITree from "../interface/Tree";

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

export default model<ITree>('trees', TreeSchema);
