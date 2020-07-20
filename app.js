import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config({ path: path.resolve(__dirname, (`../node-graphql-forester/config/.env.${process.env.NODE_ENV}`)).trim() });

import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import crypto from 'crypto';

import graphQlSchema from './src/graphql/schema/index';
import rootResolvers from './src/graphql/resolvers/index';

import isAuth from './src/middleware/is-auth';

const PORT = 3000;
const mongoURI = 'mongodb+srv://gyomber32:source32@cluster0-rpz3d.mongodb.net/forester?retryWrites=true&w=majority';

const defaultOrigin = `http://localhost:3001`;
const corsConfig = {
    origin: defaultOrigin,
    methods: ["OPTIONS", "GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
};

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'pictures'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });
let gfs;

const app = express();

app.use(cors(corsConfig));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());
app.use(isAuth);

app.use('/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: rootResolvers,
        graphiql: true
    })
);

app.route('/picture').post(upload.single('picture'), (req, res) => {
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

app.route('/picture/:id').get((req, res) => {
    if (!req.params.id) {
        return res.status(404).json({
            message: "No picture id provided"
        })
    }
    gfs.openDownloadStream(new mongoose.Types.ObjectId(req.params.id)).pipe(res);
});

app.route('/picture/:id').delete((req, res) => {
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

mongoose.connect(`mongodb+srv://gyomber32:source32@cluster0-rpz3d.mongodb.net/forester?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then((connection) => {
    app.listen(PORT);
    console.log("\n Forester NodeJS - GrpaphQL server is running!");
}).catch(error => {
    console.error(error);
});

const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'pictures'
    });
    console.log("\n Forester NodeJS - Picture storage is up \n");
});
