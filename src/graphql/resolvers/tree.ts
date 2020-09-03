import mongoose from 'mongoose';
import parseDate from "../../utils/parseDate";
import Tree from '../../models/tree';
import { Request } from "express";

export default {
    trees: async (args: any, req: Request) => {
        return Tree.find().then(trees => {
            return trees.map(tree => {
                return { ...tree, daysInSoil: parseDate(tree.datePlanted) }
            });
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    oneTree: async (args: any, req: Request) => {
        return Tree.findById(args._id).then(tree => {
            if (!tree) {
                throw new Error('Tree haven\'t been found');
            }
            return { ...tree, daysInSoil: parseDate(tree.datePlanted) }
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    createTree: async (args: any, req: Request) => {
        const tree = new Tree({
            _id: mongoose.Types.ObjectId(),
            species: args.treeInput.species,
            plantedQuantity: +args.treeInput.plantedQuantity,
            /* It's not a mistake, it's how the application works */
            survivedQuantity: +args.treeInput.plantedQuantity,
            datePlanted: new Date(args.treeInput.datePlanted).toDateString(),
            location: args.treeInput.location,
            pictureId: args.treeInput.pictureId
        });
        return tree.save().then(tree => {
            return { ...tree, daysInSoil: parseDate(tree.datePlanted) }
        }).catch(error => {
            console.error(error);
            throw error;
        });
    },

    updateTree: async (args: any, req: Request) => {
        const id = args.treeInput._id;
        const updateTree = {
            species: args.treeInput.species,
            plantedQuantity: +args.treeInput.plantedQuantity,
            survivedQuantity: +args.treeInput.survivedQuantity,
            datePlanted: new Date(args.treeInput.datePlanted).toDateString(),
            location: args.treeInput.location,
            pictureId: args.treeInput.pictureId
        };
        try {
            const updatedTree = await Tree.findByIdAndUpdate(id, updateTree, { new: true, useFindAndModify: false });
            if (!updatedTree) {
                throw new Error('Tree doesn\'t exist');
            };
            return { ...updatedTree, daysInSoil: parseDate(updatedTree.datePlanted) }
        } catch (error) {
            console.log(error);
            throw error;
        };
    },

    deleteTree: async (args: any, req: Request) => {
        return Tree.deleteOne({ _id: args._id }).then(deletedTree => {
            if (deletedTree.deletedCount !== 1) {
                throw new Error('Delete was unsuccessful');
            }
            return { _id: args._id };
        }).catch(error => {
            console.error(error);
            throw error;
        });
    }
};
