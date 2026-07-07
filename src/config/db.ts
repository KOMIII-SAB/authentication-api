import sql from "mssql";
import { env } from "./env"

const dbConfig: sql.config ={
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    server: env.DB_SERVER,
    database: env.DB_DATABASE,
    options:{
        encrypt: false,
        trustedConnection: false
    }
};

export const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log("Database Connected");
        return pool;
    })
    .catch((error => {
        console.log(dbConfig)
        console.log("Database Connection Failes", error);
        throw error;
    }));