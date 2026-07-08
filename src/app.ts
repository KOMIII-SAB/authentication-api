import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);

app.get("/", (reg,res) => {
    res.json({
        message: "API Running"
    });
});

export default app;