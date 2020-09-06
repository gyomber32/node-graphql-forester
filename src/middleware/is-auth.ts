import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

const isAuth = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    const decodedToken = jwt.verify(token, 'hatalmashatcentispenisz');
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    next();
};

export default isAuth;