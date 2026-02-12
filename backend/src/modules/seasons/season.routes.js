import { Router } from "express";
import * as seasonController from "./season.controller.js";

const router = Router();

router.post("/", seasonController.createSeason);
router.get("/:farmId", seasonController.getSeasons);

export default router;