import { Request, Response, NextFunction} from "express";
import { verifyToken } from "../utils/jwt";
import { AuthUser } from "../types/auth";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.headers.authorization;
        
        if (!authHeader){
            return res.status(401).json({
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token) as AuthUser;

        req.user = decoded;
        
        next();


    }catch (error){
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}