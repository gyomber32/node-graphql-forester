import jwt from 'jsonwebtoken';
import IPayload from '../interface/TokenPayload';
import user from '../models/user';
import User from "../models/user";

const refreshTokens = async (refreshToken: string) => {
    let userId = '';
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as IPayload;
        userId = payload.userId;
    } catch (error) {
        console.log(error);
        return {};
    }

    if (!userId) {
        return {};
    }

    try {
        const user = await User.findById(userId);
    } catch (error) {
        return {};
    }

    const payload: IPayload = { userId: userId };

    const newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_LIFE
    });
    const newRefreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
        algorithm: "HS256",
        expiresIn: process.env.REFRESH_TOKEN_LIFE
    });;
    return { newAccessToken: newAccessToken, newRefreshToken: newRefreshToken };
};

export default refreshTokens;