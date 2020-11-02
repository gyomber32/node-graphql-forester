import jwt from 'jsonwebtoken';
import IPayload from '../interface/TokenPayload';
import refreshTokens from "../utils/refreshTokens";

const isAuth = async (req: any, res: any) => {
    if (!req.cookies.accessToken) {
        req.isAuth = false;
        return req.next();
    }
    const accessToken = req.cookies.accessToken;
    try {
        jwt.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`) as IPayload;
    } catch (error) {
        try {
            if (!req.cookies.refreshToken) {
                req.isAuth = false;
                return req.next();
            }
            const refreshToken = req.cookies.refreshToken;
            const { newAccessToken, newRefreshToken } = await refreshTokens(refreshToken);
            res.cookie("accessToken", newAccessToken, { secure: true, httpOnly: true });
            res.cookie("refreshToken", newRefreshToken, { secure: true, httpOnly: true });
        } catch (error) {
            req.isAuth = false;
            return req.next();
        }
    }
    req.isAuth = true;
};

export default isAuth;