import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import IPayload from '../../interface/TokenPayload';
import User from '../../models/user';

export default {
    createUser: async (args: any) => {
        try {
            const existingUser = await User.findOne({ email: args.createUserInput.email })
            if (existingUser) {
                throw new Error('User already exists!');
            }
            const hashedPassword = await bcrypt.hash(args.createUserInput.password, 12);
            const user = new User({
                email: args.createUserInput.email,
                password: hashedPassword,
                firstName: args.createUserInput.firstName,
                lastName: args.createUserInput.lastName,
                fullName: `${args.createUserInput.firstName} ${args.createUserInput.lastName}`
            });
            const result = await user.save();
            return { ...result._doc, password: null };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    login: async (args: any, context: any) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (!user) {
                throw new Error('Invalid credentials!');
            }
            const isEqual = await bcrypt.compare(args.userInput.password, user.password);
            if (!isEqual) {
                throw new Error('Invalid credentials!');
            }
            const payload: IPayload = { userId: user.id };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
                algorithm: "HS256",
                expiresIn: Math.floor(Date.now() / 1000) + 120
            });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
                algorithm: "HS256",
                expiresIn: process.env.REFRESH_TOKEN_LIFE
            });
            context.res.cookie("accessToken", accessToken, { maxAge: process.env.TOKEN_MAX_AGE, secure: process.env.NODE_ENV === "prod", httpOnly: true });
            context.res.cookie("refreshToken", refreshToken, { maxAge: process.env.TOKEN_MAX_AGE, secure: process.env.NODE_ENV === "prod", httpOnly: true });
            return { message: "Successful login" };
        } catch (error) {
            console.log(error);
            return error;
        }
    }
};
