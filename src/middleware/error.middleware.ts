import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";

export const errorHandler = ( err: Error, req: Request, res: Response, next: NextFunction ) => {
    console.error(err);
    return errorResponse(res, err.message || "Internal Server Error", 500);
};