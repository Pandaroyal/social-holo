import { Request, Response, NextFunction } from "express";

export function LoggerMiddleware( _req: Request, _res: Response, next: NextFunction){
    console.log('Users Middleware');
    next();
}