import { Router } from "express";
import { register, login, refreshToken  } from "../controllers/auth.controller"
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../validation/auth.validation";
import { asyncHandler } from "../utils/asyncHandler"

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login))
router.post("/refresh-token", asyncHandler(refreshToken))

export default router