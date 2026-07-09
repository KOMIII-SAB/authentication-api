import jwt from "jsonwebtoken";
import { env } from "../config/env"

const JWT_SECRET = env.JWT_SECRET;

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "15"});
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};