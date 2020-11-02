import { Schema, model } from 'mongoose';
import IRefressToken from "../interface/RefressToken";

const RefressTokenSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    refressToken: {
        type: String,
        required: true
    }
});

export default model<IRefressToken>('refress_tokens', RefressTokenSchema)
