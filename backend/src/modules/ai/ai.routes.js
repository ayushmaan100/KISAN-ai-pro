import { Router } from "express";
import multer from "multer";
import * as aiController from "./ai.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// Configure temporary storage for uploaded images
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("image"), aiController.analyzeImage);
router.get("/recommend/:farmId", requireAuth, aiController.getCropRecommendations);

export default router;