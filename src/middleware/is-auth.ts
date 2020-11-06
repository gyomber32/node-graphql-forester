import jwt from 'jsonwebtoken';
import IPayload from '../interface/TokenPayload';
import refreshTokens from "../utils/refreshTokens";

const isAuth = async (req: any, res: any) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        req.isAuth = false;
        return req.next();
    }
    try {
        jwt.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`) as IPayload;
    } catch (error) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            req.isAuth = false;
            return req.next();
        }
        const { newAccessToken, newRefreshToken } = await refreshTokens(refreshToken);
        if (newAccessToken && newRefreshToken) {
            res.cookie("accessToken", newAccessToken, { maxAge: process.env.TOKEN_MAX_AGE, secure: process.env.NODE_ENV === "prod", httpOnly: true });
            res.cookie("refreshToken", newRefreshToken, { maxAge: process.env.TOKEN_MAX_AGE, secure: process.env.NODE_ENV === "prod", httpOnly: true });
            req.isAuth = true;
            return req.next();
        }
    }
    req.isAuth = true;
    return req.next();
};

export default isAuth;