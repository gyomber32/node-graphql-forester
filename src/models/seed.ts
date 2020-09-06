import { Schema, model } from 'mongoose';
import ISeed from "../interface/Seed";

const SeedSchema = new Schema({
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
        type: String,
        required: true
    }
},
    { timestamps: true }
);

export default model<ISeed>('seeds', SeedSchema);
