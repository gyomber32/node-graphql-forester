import { Document } from "mongoose";

interface MongoResult {
    _doc: any
};

interface IUser extends Document, MongoResult {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;
    refressToken: string;
};

export default IUser;