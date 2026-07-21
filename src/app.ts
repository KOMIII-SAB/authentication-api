import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
import authRoute from "./routes/auth.routes";
import userRoute from "./routes/user.routes";
import adminRoute from "./routes/admin.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API is running"
    });
});

app.get("/test-error", (req, res, next) => {
    next(new Error("Test error"));
});

app.use(errorHandler);

export default app;