import { Request, Response } from "express";
import { findByEmail, createUser, updateRefreshToken, findByRefreshToken } from "../services/user.services";
import { hashPassword } from "../utils/password";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { generateRefreshToken } from "../utils/refreshToken";
import { successResponse } from "../utils/response";
import { clearRefreshToken } from "../services/user.services";

export const register = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await findByEmail(email);

        if (existingUser){
            return res.status(409).json({
                message: "Email already exist"
            });
        }

        const passwordHash = await hashPassword(password);
        
        const newUser = await createUser({
            name, email, passwordHash, role: "user"
        });

        return successResponse(
            res,
            "User registered successfully",
            {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            201
        );
};

export const login = async (req:Request, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        const user = await findByEmail(email);

        if (!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        
        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = generateToken({id: user.id, role: user.role});

        const refreshToken = generateRefreshToken();

        await updateRefreshToken(user.id!, refreshToken);

        return successResponse(
            res,
            "Login successful",
            {
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        );
};

export const refreshToken = async (req:Request, res:Response) => {
        const { refreshToken } = req.body;

        if (!refreshToken){
            return res.status(400).json({
                message: "Refresh token is required"
            });
        }

        const user = await findByRefreshToken(refreshToken);

        if (!user){
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = generateToken({
            id: user.id,
            role: user.role
        });

        const newRefreshToken = generateRefreshToken();

        await updateRefreshToken(
            user.id!,
            newRefreshToken
        );

        return successResponse(
            res,
            "Token refreshed successfully",
            {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        );
}

export const logout = async (req: Request, res: Response) => {
    await clearRefreshToken(req.user!.id);

    return successResponse(
        res,
        "Logout successful"
    );
};



