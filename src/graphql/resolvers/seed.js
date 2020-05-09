import mongoose from 'mongoose';
var Seed = require('../../models/seed');

module.exports = {
    seeds: async () => {
        return Seed.find().then(seeds => {
            return seeds.map(seed => {
                return { ...seed._doc }
            });
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },
    createSeed: async (args) => {
        const seed = new Seed({
            _id: mongoose.Types.ObjectId(),
            species: args.seedInput.species,
            seededQuantity: +args.seedInput.seededQuantity,
            brairdedQuantity: +args.seedInput.brairdedQuantity,
            dateSeeded: args.seedInput.dateSeeded
        });
        return seed.save().then(seed => {
            return { ...seed._doc };
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
