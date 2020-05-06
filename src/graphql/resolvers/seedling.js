import mongoose from 'mongoose';

if (process.env.NODE_ENV === 'dev') {
    var Seedling = require('../../models/seedling');
};
if (process.env.NODE_ENV === 'prod') {
    var Seedling = require('./dist/models/planting');
};

module.exports = {
    seedlings: () => {
        return Seedling.find().then(seedlings => {
            return seedlings.map(seedling => {
                return { ...seedling._doc }
            });
        }).catch(error => {
            console.error(error);
        });
    },
    createSeedling: args => {
        const seedling = new Seedling({
            _id: mongoose.Types.ObjectId(),
            species: args.plantingInput.species,
            plantedQuantity: +args.plantingInput.plantedQuantity,
            datePlanted: new Date(args.plantingInput.datePlanted),
            location: args.plantingInput.location,
            picture: args.plantingInput.picture
        });
        return seedling.save().then(seedling => {
            return { ...seedling._doc };
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
