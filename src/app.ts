import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.routes";
import userRoute from "./routes/user.routes";
import adminRoute from "./routes/admin.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

app.use(errorHandler);

app.get("/", (req,res) => {
    res.json({
        message: "API Running"
    });
});

export default app;