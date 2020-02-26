import { buildSchema } from "graphql";

export default buildSchema(`
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
    `);
