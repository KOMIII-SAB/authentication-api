import app from "./app";
import { env } from "./config/env";
import { getPool } from "./config/db";

const PORT = env.PORT;

getPool()
    .then(() => {
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error => {
        console.log("Server Cannot Start", error)
    }))