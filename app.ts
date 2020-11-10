import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config({ path: path.resolve(__dirname, (`config/.env.${process.env.NODE_ENV}`)).trim() });

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { graphqlExpress } from 'graphql-server-express';
import mongoose from 'mongoose';

import graphQlSchema from './src/graphql/schema/index';
import rootResolvers from './src/graphql/resolvers/index';

import isAuth from './src/middleware/is-auth';
import uploadImage from "./src/utils/imageUpload";

const defaultOrigin = process.env.DEFAULT_ORIGIN;
const corsConfig = {
    origin: defaultOrigin,
    methods: ["OPTIONS", "GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    credentials: true,
    optionsSuccessStatus: 200
};

let gfs: any;

const app = express();
app.use(cors(corsConfig));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(isAuth);

app.use('/graphql',
    graphqlExpress((req: any, res: any) => ({
        schema: graphQlSchema,
        rootValue: rootResolvers,
        context: {
            res,
            isAuth: req.isAuth
        }
    }))
);

app.route('/picture').post(uploadImage.single('picture'), (req: any, res: Response) => {
    if (!req.file) {
        return res.status(203).json({
            id: "",
            message: "No picture id provided"
        });
    }
    if (req.file.id) {
        return res.status(200).json({
            id: req.file.id,
            message: "Picture successfully uploaded"
        });
    }
});

app.route('/picture/:id').get((req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(404).json({
            message: "No picture id provided"
        })
    }
    gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id)).pipe(res);
});

app.route('/picture/:id').delete((req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(404).json({
            message: "No picture id provided"
        })
    }
    try {
        gfs.delete(new mongoose.Types.ObjectId(req.params.id));
        return res.status(200).json({
            message: "Picture has been successfully deleted"
        });
    } catch (error) {
        return res.status(404).json({
            message: "Delete was unsuccessful"
        });
    }
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DATABASE_URI}/${process.env.DATABASE}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then((connection) => {
    app.listen(process.env.PORT);
    console.log("\n Forester NodeJS - GrpaphQL server is running!");
}).catch(error => {
    console.error(error);
});

const conn = mongoose.createConnection(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DATABASE_URI}/${process.env.DATABASE}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//bucket has to have separated/individual connection

conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: process.env.GRIDFS_BUCKET_NAME
    });
    console.log("\n Forester NodeJS - Picture storage is up \n");
});
