import mongoose from 'mongoose';
var Seedling = require('../../models/seedling');

module.exports = {
    seedlings: async () => {
        return Seedling.find().then(seedlings => {
            return seedlings.map(seedling => {
                return { ...seedling._doc };
            });
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },
    createSeedling: async (args) => {
        const seedling = new Seedling({
            _id: mongoose.Types.ObjectId(),
            species: args.seedlingInput.species,
            plantedQuantity: +args.seedlingInput.plantedQuantity,
            survivedQuantity: +args.seedlingInput.survivedQuantity,
            datePlanted: args.seedlingInput.datePlanted,
            location: args.seedlingInput.location,
            picture: args.seedlingInput.picture
        });
        return seedling.save().then(seedling => {
            return { ...seedling._doc };
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
