import mongoose from 'mongoose';

if (process.env.NODE_ENV === 'dev') {
    var Planting = require('../../models/planting');
};
if (process.env.NODE_ENV === 'prod') {
    var Planting = require('./dist/models/planting');
};

module.exports = {
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
            return { ...result._doc };
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
