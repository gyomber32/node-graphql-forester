import { buildSchema } from "graphql";

export default buildSchema(`
        type Seedling {
            _id: ID!
            species: String!
            plantedQuantity: Int!
            survivedQuantity: Int!
            datePlanted: String!
            location: String!
            picture: String
        }

        type Seed {
            _id: ID!
            species: String!
            seededQuantity: Int!
            brairdedQuantity: Int!
            dateSeeded: String!
        }

        type User {
            _id: ID
            email: String!
            password: String
        }

        type Authdata {
            _id: ID
            token: String!
            tokenExpiration: Int!
        }

        type Message {
            message: String!
        }

        input SeedlingInput {
            _id: ID
            species: String!
            plantedQuantity: Int!
            survivedQuantity: Int
            datePlanted: String!
            location: String!
            picture: String
        }

        input SeedInput {
            _id: ID!
            species: String!
            seededQuantity: Int!
            brairdedQuantity: Int
            dateSeeded: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            seedlings: [Seedling!]
            oneSeedling(_id: ID!): Seedling
            seeds: [Seed!]
            oneSeed(_id: ID!): Seed 
            login(userInput: UserInput): Authdata!
        }

        type RootMutation {
            createSeedling(seedlingInput: SeedlingInput!): Seedling
            updateSeedling(seedlingInput: SeedlingInput!): Seedling
            deleteSeedling(_id: ID!): Message
            createSeed(seedInput: SeedInput!): Seed
            updateSeed(seedInput: SeedInput!): Seed
            deleteSeed(_id: ID!): Message
            createUser(userInput: UserInput!): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
