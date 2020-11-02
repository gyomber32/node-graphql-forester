import { Document } from 'mongoose';

interface MongoResult {
    _doc: any
};

interface IRefressToken extends Document, MongoResult {
    _id: string;
    userId: string;
    refressToken: string;
};

export default IRefressToken;
