import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, (`../node-graphql-forester/config/.env.${process.env.NODE_ENV}`)).trim() });

import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let Planting;
let User;

if (process.env.NODE_ENV === 'dev') {
    Planting = require('./src/models/planting');
    User = require('./src/models/user');
};
if (process.env.NODE_ENV === 'prod') {
    Planting = require('./dist/models/planting');
    User = require('./dist/models/user');
};

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

        type User {
            _id: ID!
            email: String!
            password: String
        }

        type Authdata {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        input PlantingInput {
            species: String!
            quantity: Int!
            planting_date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            plantings: [Planting!]!
            login(userInput: UserInput): Authdata!
        }

        type RootMutation {
            createPlanting(plantingInput: PlantingInput): Planting
            createUser(userInput: UserInput): User
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
        },
        createUser: args => {
            return User.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) {
                        throw new Error('User already exists!');
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                }).then(hashedPassword => {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                }).then(result => {
                    console.log(result);
                    return { ...result._doc, password: null };
                }).catch(error => {
                    console.error(error);
                    throw error;
                });
        },
        login: async (args) => {
            try {
                const user = await User.findOne({ email: args.userInput.email });
                if (!user) {
                    throw new Error('User does not exist!');
                }
                const isEqual = await bcrypt.compare(args.userInput.password, user.password);
                if (!isEqual) {
                    throw new Error('Invalid credetials!');
                }
                const token = jwt.sign({ userId: user.id, email: user.email }, 'hatalmashatcentispenisz', {
                    expiresIn: '1h'
                });
                return { userId: user._id, token: token, tokenExpiration: 1 };
            } catch (error) {
                throw error;
            }
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(3000);
    console.log(" \n Forester NodeJS - GrpaphQL server running! \n");
}).catch(error => {
    console.error(error);
});