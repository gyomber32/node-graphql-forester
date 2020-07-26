import mongoose from 'mongoose';
import parseDate from "../../utils/parseDate";
var Seedling = require('../../models/seedling');

module.exports = {
    seedlings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        return Seedling.find().then(seedlings => {
            return seedlings.map(seedling => {
                return { ...seedling._doc, daysInSoil: parseDate(seedling.datePlanted) }
            });
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    oneSeedling: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        return Seedling.findById(args._id).then(seedling => {
            if (!seedling) {
                throw new Error('Seedling haven\'t been found');
            }
            return { ...seedling._doc, daysInSoil: parseDate(seedling.datePlanted) }
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    createSeedling: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        const seedling = new Seedling({
            _id: mongoose.Types.ObjectId(),
            species: args.seedlingInput.species,
            plantedQuantity: +args.seedlingInput.plantedQuantity,
            survivedQuantity: +args.seedlingInput.plantedQuantity,
            datePlanted: new Date(args.seedlingInput.datePlanted).toDateString(),
            location: args.seedlingInput.location,
            picture: args.seedlingInput.picture,
            pictureId: args.seedlingInput.pictureId
        });
        return seedling.save().then(seedling => {
            return { ...seedling._doc, daysInSoil: parseDate(seedling.datePlanted) }
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    updateSeedling: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        const id = args.seedlingInput._id;
        const updateSeedling = {
            species: args.seedlingInput.species,
            plantedQuantity: +args.seedlingInput.plantedQuantity,
            survivedQuantity: +args.seedlingInput.survivedQuantity,
            datePlanted: new Date(args.seedlingInput.datePlanted).toDateString(),
            location: args.seedlingInput.location,
            picture: args.seedlingInput.picture,
            pictureId: args.seedlingInput.pictureId
        };
        try {
            const updatedSeedling = await Seedling.findByIdAndUpdate(id, updateSeedling, { new: true, useFindAndModify: false });
            if (!updatedSeedling) {
                throw new Error('Seedling doesn\'t exist');
            };
            return { ...updatedSeedling._doc, daysInSoil: parseDate(updatedSeedling.datePlanted) }
        } catch (error) {
            console.log(error);
            throw error;
        };
    },

    deleteSeedling: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        }
        return Seedling.deleteOne({ _id: args._id }).then(deletedSeedling => {
            if (deletedSeedling.deletedCount !== 1) {
                throw new Error('Delete was unsuccessful');
            }
            const response = { message: "Seedling deleted successfully" };
            return response;
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
