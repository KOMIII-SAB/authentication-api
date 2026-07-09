import { Request, Response} from "express";
import { findByEmail, createUser, updateRefreshToken } from "../services/user.services";
import { hashPassword } from "../utils/password";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { generateRefreshToken } from "../utils/refreshToken";

export const register = async (req: Request, res: Response) => {
    try {
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


        res.status(201).json({
            message: "User registered succesfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const login = async (req:Request, res: Response) => {
    try{
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

        return res.status(200).json({
            message: "Login succesful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const refreshToken = async (req:Request, res:Response) => {
    try{
        return res.status(200).json({
            message: "Refresh token endpoint working"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        })
    }
}

