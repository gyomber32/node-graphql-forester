import { Document } from "mongoose";

interface MongoResult {
    _doc: any
};

interface ITree extends Document, MongoResult {
    _id: string;
    species: string;
    plantedQuantity: number;
    survivedQuantity: number;
    datePlanted: string;
    location: string;
    pictureId: string;
};

export default ITree;
