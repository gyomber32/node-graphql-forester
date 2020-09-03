import { buildSchema } from "graphql";

export default buildSchema(`
        type Tree {
            _id: ID!
            species: String!
            plantedQuantity: Int!
            survivedQuantity: Int!
            datePlanted: String!
            daysInSoil: String!
            location: String!
            pictureId: String
        }

        type Seedling {
            _id: ID!
            species: String!
            plantedQuantity: Int!
            survivedQuantity: Int!
            datePlanted: String!
            daysInSoil: String!
            location: String!
            pictureId: String
        }

        type Seed {
            _id: ID!
            species: String!
            seededQuantity: Int!
            brairdedQuantity: Int!
            dateSeeded: String!
            daysInSoil: String!
        }

        type User {
            _id: ID
            email: String!
            password: String
        }

        type Authdata {
            _id: ID
            token: String!
            tokenExpiration: String!
        }

        type Id {
            _id: ID!
        }

        input TreeInput {
            _id: ID
            species: String!
            plantedQuantity: Int!
            survivedQuantity: Int
            datePlanted: String!
            location: String!
            pictureId: String
        }

        input SeedlingInput {
            _id: ID
            species: String!
            plantedQuantity: Int!
            survivedQuantity: Int
            datePlanted: String!
            location: String!
            pictureId: String
        }

        input SeedInput {
            _id: ID
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
            trees:  [Tree!]
            oneTree(_id: ID!): Tree
            seedlings: [Seedling!]
            oneSeedling(_id: ID!): Seedling
            seeds: [Seed!]!
            oneSeed(_id: ID!): Seed 
            login(userInput: UserInput): Authdata
        }

        type RootMutation {
            createTree(treeInput: TreeInput!): Tree
            updateTree(treeInput: TreeInput!): Tree
            deleteTree(_id: ID!): Id
            createSeedling(seedlingInput: SeedlingInput!): Seedling
            updateSeedling(seedlingInput: SeedlingInput!): Seedling
            deleteSeedling(_id: ID!): Id
            createSeed(seedInput: SeedInput!): Seed
            updateSeed(seedInput: SeedInput!): Seed
            deleteSeed(_id: ID!): Id
            createUser(userInput: UserInput!): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);