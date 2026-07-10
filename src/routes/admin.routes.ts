import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
    res.json({
        message: "Welcome admin"
    });
});

router.get("/dashboard", authenticate, authorize("admin"), (req, res) => {
    res.json({
        message: "Welcome to admin dashboard",
        user: req.user
    });
});

export default router;