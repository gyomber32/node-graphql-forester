import { Document } from "mongoose";

interface MongoResult {
    _doc: any
};

interface IUser extends Document, MongoResult {
    _id: string;
    email: string;
    password: string;
};

export default IUser;