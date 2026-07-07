import dotenv from "dotenv";

dotenv.config();

interface envConfig  {
    PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_SERVER: string;
    DB_DATABASE: string;
}

export const env: envConfig = {
    PORT: Number(process.env.PORT) || 5000,
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_SERVER: process.env.DB_SERVER || "",
    DB_DATABASE: process.env.DB_DATABASE || ""
};