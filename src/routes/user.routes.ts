import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router()

router.get("/profile", authenticate, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

export default router;