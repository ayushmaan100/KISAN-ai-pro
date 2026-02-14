import { Router } from "express";
import multer from "multer";
import * as aiController from "./ai.controller.js";

const router = Router();

// Configure temporary storage for uploaded images
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("image"), aiController.analyzeImage);

export default router;