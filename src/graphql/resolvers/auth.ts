import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user';

export default {
    createUser: async (args: any) => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User already exists!');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return { ...result, password: null };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    login: async (args: any) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (!user) {
                throw new Error('Invalid credentials!');
            }
            const isEqual = await bcrypt.compare(args.userInput.password, user.password);
            if (!isEqual) {
                throw new Error('Invalid credentials!');
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, 'hatalmashatcentispenisz', {
                expiresIn: '1h'
            });
            return { _id: user._id, token: token, tokenExpiration: new Date((new Date()).getTime() + 3600000) };
        } catch (error) {
            console.log(error);
            return error;
        }
    }
};
