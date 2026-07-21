import sql from "mssql";
import { env } from "./env";

const dbConfig: sql.config = {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    server: env.DB_SERVER,
    database: env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool: sql.ConnectionPool | null = null;

export const getPool = async (): Promise<sql.ConnectionPool> => {
    if (!pool) {
        pool = await new sql.ConnectionPool(dbConfig).connect();

        console.log("Database Connected");
    }

    return pool;
};