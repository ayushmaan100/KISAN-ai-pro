import { Router } from "express";
import * as farmController from "./farm.controller.js";

const router = Router();

router.post("/", farmController.createFarm);
router.get("/", farmController.getFarms);

export default router;