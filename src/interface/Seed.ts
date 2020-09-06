import { Document } from 'mongoose';

interface MongoResult {
    _doc: any
};

interface ISeed extends Document, MongoResult {
    _id: string;
    species: string;
    seededQuantity: number;
    brairdedQuantity: number;
    dateSeeded: string;
    location: string;
};

export default ISeed;