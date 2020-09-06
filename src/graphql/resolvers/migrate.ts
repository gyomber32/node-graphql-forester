import parseDate from "../../utils/parseDate";
import Seed from "../../models/seed";
import Seedling from '../../models/seedling';
import Tree from "../../models/tree";

export default {

    seedToSeedling: async (args: any, req: any) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        };
        try {
            const seed = await Seed.findById(args.migrateSeedInput._id);
            if (!seed) {
                throw new Error('Seed haven\'t been found');
            };
            const seedling = await new Seedling({
                species: args.migrateSeedInput.species,
                plantedQuantity: args.migrateSeedInput.plantedQuantity,
                survivedQuantity: args.migrateSeedInput.survivedQuantity,
                datePlanted: new Date(args.migrateSeedInput.datePlanted).toDateString(),
                location: args.migrateSeedInput.location,
                pictureId: args.migrateSeedInput.pictureId,
                derivedFromSeed: true
            }).save();
            const deletedSeed = await Seed.deleteOne({ _id: args._id });
            if (deletedSeed.deletedCount !== 1) {
                throw new Error('Delete was unsuccessful');
            };
            return { ...seedling._doc, daysInSoil: parseDate(seedling.datePlanted) }
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    seedlingToTree: async (args: any, req: any) => {
        if (!req.isAuth) {
            throw new Error('Unauthorized!');
        };
        try {
            const seedling = await Seedling.findById(args.migrateSeedlingInput._id);
            if (!seedling) {
                throw new Error('Seedling hasn\'t been found');
            };
            const tree = await new Tree({
                species: args.migrateSeedlingInput.species,
                plantedQuantity: args.migrateSeedlingInput.plantedQuantity,
                survivedQuantity: args.migrateSeedlingInput.survivedQuantity,
                datePlanted: new Date(args.migrateSeedlingInput.datePlanted).toDateString(),
                location: args.migrateSeedlingInput.location,
                pictureId: args.migrateSeedlingInput.pictureId,
                derivedFromSeed: seedling.derivedFromSeed
            }).save();
            if (args.migrateSeedlingInput.plantedQuantity < seedling.survivedQuantity) {
                seedling.survivedQuantity -= args.migrateSeedlingInput.plantedQuantity;
                seedling.save();
            };
            if (args.migrateSeedlingInput.plantedQuantity === seedling.survivedQuantity) {
                const deletedSeedling = await Seedling.deleteOne({ _id: seedling._id });
                if (deletedSeedling.deletedCount !== 1) {
                    throw new Error('Delete was unsuccessful');
                };
            };
            return { ...tree._doc, daysInSoil: parseDate(tree.datePlanted) }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
