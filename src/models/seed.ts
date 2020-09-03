import { Schema, model, Document } from 'mongoose';

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

interface ISeed extends Document {
    _id: string;
    species: string;
    seededQuantity: number;
    brairdedQuantity: number;
    dateSeeded: string;
};

export default model<ISeed>('seeds', SeedSchema);
