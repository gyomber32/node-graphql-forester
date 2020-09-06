import { Schema, model } from 'mongoose';
import IUser from "../interface/User";

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default model<IUser>('users', UserSchema)
