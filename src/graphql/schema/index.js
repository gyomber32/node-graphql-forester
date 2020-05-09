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
            _id: ID!
            email: String!
            password: String
        }

        type Authdata {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        input SeedlingInput {
            species: String!
            plantedQuantity: Int!
            survivedQuantity: Int
            datePlanted: String!
            location: String!
            picture: String
        }

        input SeedInput {
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
            seeds: [Seed!]
            login(userInput: UserInput): Authdata!
        }

        type RootMutation {
            createSeedling(seedlingInput: SeedlingInput): Seedling
            createSeed(seedInput: SeedInput): Seed
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
