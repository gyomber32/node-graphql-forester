import mongoose from 'mongoose';

if (process.env.NODE_ENV === 'dev') {
    var Seed = require('../../models/seed');
};
if (process.env.NODE_ENV === 'prod') {
    var Seed = require('./dist/models/seed');
};

module.exports = {
    seeds: () => {
        return Seed.find().then(seed => {
            return seed.map(seed => {
                return { ...seed._doc }
            });
        }).catch(error => {
            console.error(error);
        });
    },
    createSeed: args => {
        const seed = new Seed({
            _id: mongoose.Types.ObjectId(),
            species: args.plantingInput.species,
            seededQuantity: +args.plantingInput.seededQuantity,
            dateSeeded: new Date(args.plantingInput.dateSeeded)
        });
        return seed.save().then(seed => {
            return { ...seed._doc };
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
