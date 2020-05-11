import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

var User = require('../../models/user');

module.exports = {
    createUser: async (args) => {
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
            return { _id: user._id, token: token, tokenExpiration: 1 };
        } catch (error) {
            throw error;
        }
    }
};
