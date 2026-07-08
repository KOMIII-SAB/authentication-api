import { Request, Response} from "express";
import { findByEmail, createUser } from "../services/user.services";
import { hashPassword } from "../utils/password";

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

        return res.status(200).json({
            message: "Login endpoint working"
        });


    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};