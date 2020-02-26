import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

if (process.env.NODE_ENV === 'dev') {
    var Planting = require('../../models/planting');
    var User = require('../../models/user');
};
if (process.env.NODE_ENV === 'prod') {
    var Planting = require('./dist/models/planting');
    var User = require('./dist/models/user');
};

const graphQlResolvers = {
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
    },
    createUser: args => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
                if (user) {
                    throw new Error('User already exists!');
                }
                return bcrypt.hash(args.userInput.password, 12);
            }).then(hashedPassword => {
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            }).then(result => {
                return { ...result._doc, password: null };
            }).catch(error => {
                console.error(error);
                throw error;
            });
    },
    login: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (!user) {
                throw new Error('User does not exist!');
            }
            const isEqual = await bcrypt.compare(args.userInput.password, user.password);
            if (!isEqual) {
                throw new Error('Invalid credetials!');
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, 'hatalmashatcentispenisz', {
                expiresIn: '1h'
            });
            return { userId: user._id, token: token, tokenExpiration: 1 };
        } catch (error) {
            throw error;
        }
    }
}

export default graphQlResolvers;