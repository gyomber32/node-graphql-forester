import { Schema, model } from 'mongoose';
import ISeedling from "../interface/Seedling";

const SeedlingSchema = new Schema({
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

export default model<ISeedling>('seedlings', SeedlingSchema);
