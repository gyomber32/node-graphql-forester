import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, (`../node-graphql-forester/config/.env.${process.env.NODE_ENV}`)).trim() });

import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';

import graphQlSchema from './src/graphql/schema/index';
import rootResolvers from './src/graphql/resolvers/index';

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

/* app.post('/graphql', (req, res) => {
    console.log(req.body)
  }) */

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: rootResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://gyomber32:source32@cluster0-rpz3d.mongodb.net/forester?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then((connection) => {
    app.listen(3000);
    console.log(" \n Forester NodeJS - GrpaphQL server running! \n");
}).catch(error => {
    console.error(error);
});

/*if (process.env.NODE_ENV === 'prod') {
    const MONGO_USER = process.argv[0];
    const MONGO_PASSWORD = process.argv[1];
    const MONGO_CLUSTER = process.argv[2];
    const MONGO_DB = process.argv[3];
    mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        app.listen(3000);
        console.log(" \n Forester NodeJS - GrpaphQL server running! \n");
    }).catch(error => {
        console.error(error);
    });*/
