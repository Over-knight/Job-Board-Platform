import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenExpiredError } from "jsonwebtoken";

interface JwtPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    // let token: string | undefined;
    const authHeader = req.headers.authorization;
    // if (authHeader && authHeader.startsWith("Bearer")) {
    // }
    if (!authHeader?.startsWith("Bearer")) {
        res.status(401).json({ message: "Not authorized, token missing"});
        return;
    }
    const token = authHeader.split(" ")[1];
    
    // if (token) {
    //     res.status(401).json({ message: "Not authorized, token missing"});
    //     return;
    // }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        // console.log("Decoded JWT:", decoded); //was used for testing
        req.user = {id: decoded.id, role: decoded.role};
        return next(); 
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(401).json({ message: "Session expired, Please log in again" });
            return;
        }
        console.error("JWT verification error:", error);
        res.status(401).json({ message: "Not authorized, token failed"});
        return;
    }
};