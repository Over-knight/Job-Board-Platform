import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (payload: object) =>{
    const secret = process.env.JWT_SECRET;
    if ( !secret) {
        throw new Error("Missing JWT_SECRET");
    }
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || "3d",
    } as SignOptions;
    return jwt.sign(payload, secret, options);
};