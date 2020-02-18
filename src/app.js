import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    // does graphql contains Date type -> planting_date
    schema: buildSchema(`

        type Planting {
            id: ID!
            species: String
            planted: Int
            survived: Int
            planting_date: String
        }

        type RootQuery {
            planting: [Planting!]!
        }

        type RootMutation {
            createPlanting(species: String, planted: Int, planting_date: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        planting: () => {
            // gonna return Plating Array
            return null
        },
        createPlanting: (args) => {
            // gonna create Plating
            const species = args.species;
            const planted = args.planted;
            const planting_date = args.planting_date;
            return null;
        }
    },
    graphiql: true
}));

app.listen(3000);