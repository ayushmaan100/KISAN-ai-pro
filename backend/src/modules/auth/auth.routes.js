import { Router } from "express";
import { registerHandler, loginHandler } from "./auth.controller.js";
import { requireAuth } from '../../middleware/auth.middleware.js';
import { updateProfile } from "./auth.controller.js";

const router = Router();

// POST /api/v1/auth/register
router.post("/register", registerHandler);

// POST /api/v1/auth/login
router.post("/login", loginHandler);

router.put('/profile', requireAuth, updateProfile);

export default router;