import app from "./app";
import { env } from "./config/env";
import { poolPromise } from "./config/db";

const PORT = env.PORT;

poolPromise
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error => {
        console.log("Server Cannot Start", error)
    }))