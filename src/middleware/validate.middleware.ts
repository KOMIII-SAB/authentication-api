import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (scheme: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            scheme.parse(req.body);

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: error.issues.map(issue => ({
                        field: issue.path[0],
                        message: issue.message
                    }))
                });
            }
            return res.status(500).json({
                message: "Server error"
            });
        }
    };
};