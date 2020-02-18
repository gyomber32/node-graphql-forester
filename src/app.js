import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import Planting from './models/planting';

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Planting {
            _id: ID!
            species: String!
            quantity: Int!
            survived: Int
            planting_date: String!
        }

        input PlantingInput {
            species: String!
            quantity: Int!
            planting_date: String!
        }

        type RootQuery {
            plantings: [Planting!]!
        }

        type RootMutation {
            createPlanting(plantingInput: PlantingInput): Planting
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        plantings: () => {
            return Planting.find().then(plantings => {
                return plantings.map(planting => {
                    return { ...planting._doc }
                });
            }).catch(error => {
                console.error(error);
            });
        },
        createPlanting: args => {
            const planting = new Planting({
                _id: mongoose.Types.ObjectId(),
                species: args.plantingInput.species,
                quantity: +args.plantingInput.quantity,
                planting_date: new Date(args.plantingInput.planting_date)
            });
            return planting.save().then(result => {
                console.log(result);
                return { ...result._doc };
            }).catch(error => {
                console.error(error);
                throw error;
            });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-rpz3d.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() => {
    app.listen(3000);
}).catch(error => {
    console.error(error);
});