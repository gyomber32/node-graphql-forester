import mongoose from 'mongoose';
import parseDate from "../../utils/parseDate";
import Seed from '../../models/seed';
import { Request } from "express";

export default {
    seeds: async (args: any, req: Request) => {
        return Seed.find().then(seeds => {
            return seeds.map(seed => {
                return { ...seed, daysInSoil: parseDate(seed.dateSeeded) }
            });
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    oneSeed: async (args: any, req: Request) => {
        return Seed.findById(args._id).then(seed => {
            if (!seed) {
                throw new Error('Seed haven\'t been found');
            }
            return { ...seed, daysInSoil: parseDate(seed.dateSeeded) }
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    createSeed: async (args: any, req: Request) => {
        const seed = new Seed({
            _id: mongoose.Types.ObjectId(),
            species: args.seedInput.species,
            seededQuantity: +args.seedInput.seededQuantity,
            /* It's not a mistake, it's how the application works */
            brairdedQuantity: +args.seedInput.seededQuantity,
            dateSeeded: new Date(args.seedInput.dateSeeded).toDateString(),
        });
        return seed.save().then(seed => {
            return { ...seed, daysInSoil: parseDate(seed.dateSeeded) }
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    updateSeed: async (args: any, req: Request) => {
        const id = args.seedInput._id;
        const updateSeed = {
            species: args.seedInput.species,
            seededQuantity: +args.seedInput.seededQuantity,
            brairdedQuantity: +args.seedInput.brairdedQuantity,
            dateSeeded: new Date(args.seedInput.dateSeeded).toDateString(),
        };
        try {
            const updatedSeed = await Seed.findByIdAndUpdate(id, updateSeed, { new: true, useFindAndModify: false });
            if (!updatedSeed) {
                throw new Error('Seed doesn\'t exist');
            };
            return { ...updatedSeed, daysInSoil: parseDate(updatedSeed.dateSeeded) }
        } catch (error) {
            console.log(error);
            throw error;
        };
    },

    deleteSeed: async (args: any, req: Request) => {
        return Seed.deleteOne({ _id: args._id }).then(deletedSeed => {
            if (deletedSeed.deletedCount !== 1) {
                throw new Error('Delete was unsuccessful');
            }
            return { _id: args._id };
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
