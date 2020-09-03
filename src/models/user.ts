import { Schema, model, Document } from 'mongoose';

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

interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
};

export default model<IUser>('users', UserSchema)
