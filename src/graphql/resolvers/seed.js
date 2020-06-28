import mongoose from 'mongoose';
var Seed = require('../../models/seed');

module.exports = {
    seeds: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        return Seed.find().then(seeds => {
            return seeds.map(seed => {
                return { ...seed._doc }
            });
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    oneSeed: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        return Seed.findById(args._id).then(seed => {
            if (!seed) {
                throw new Error('Seed haven\'t been found');
            }
            return { ...seed._doc }
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    createSeed: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
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
    },

    updateSeed: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        const id = args.seedInput._id;
        const updateSeed = {
            species: args.seedInput.species,
            seededQuantity: +args.seedInput.seededQuantity,
            brairdedQuantity: +args.seedInput.brairdedQuantity,
            dateSeeded: args.seedInput.dateSeeded
        };
        try {
            const updatedSeed = await Seed.findByIdAndUpdate(id, updateSeed, { new: true, useFindAndModify: false });
            if (!updatedSeed) {
                throw new Error('Seed doesn\'t exist');
            };
            return { ...updatedSeed._doc };
        } catch (error) {
            console.log(error);
            throw error;
        };
    },

    deleteSeed: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        return Seed.deleteOne({ _id: args._id }).then(deletedSeed => {
            if (deletedSeed.deletedCount !== 1) {
                throw new Error('Delete was unsuccessful');
            }
            const message = { message: "Seed deleted successfully" };
            return message;
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
