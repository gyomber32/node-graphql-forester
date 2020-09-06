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
            const seed = await Seed.findById(args.migrateInput._id);
            if (!seed) {
                throw new Error('Seed haven\'t been found');
            };
            const seedling = await new Seedling({
                species: args.migrateInput.species,
                plantedQuantity: args.migrateInput.plantedQuantity,
                survivedQuantity: args.migrateInput.survivedQuantity,
                datePlanted: new Date(args.migrateInput.datePlanted).toDateString(),
                location: args.migrateInput.location,
                pictureId: args.migrateInput.pictureId,
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
            const seedling = await Seedling.findById(args.migrateInput._id);
            if (!seedling) {
                throw new Error('Seedling hasn\'t been found');
            };
            const tree = await new Tree({
                species: args.migrateInput.species,
                plantedQuantity: args.migrateInput.plantedQuantity,
                survivedQuantity: args.migrateInput.survivedQuantity,
                datePlanted: new Date(args.migrateInput.datePlanted).toDateString(),
                location: args.migrateInput.location,
                pictureId: args.migrateInput.pictureId,
                derivedFromSeed: seedling.derivedFromSeed
            }).save();
            if (args.migrateInput.plantedQuantity < seedling.survivedQuantity) {
                seedling.survivedQuantity -= args.migrateInput.plantedQuantity;
                seedling.save();
            };
            if (args.migrateInput.plantedQuantity === seedling.survivedQuantity) {
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
