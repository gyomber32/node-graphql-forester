import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Error('Unauthorized!');
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        throw new Error('Unauthorized!');
    }
    const decodedToken = jwt.verify(token, 'hatalmashatcentispenisz');
    if (!decodedToken) {
        throw new Error('Forbidden!');    
    }
    next();
};

export default isAuth;