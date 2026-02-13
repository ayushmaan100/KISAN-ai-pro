import { Router } from "express";
import * as taskController from "./task.controller.js";

const router = Router();

router.get("/", taskController.getMyTasks);
router.patch("/:taskId", taskController.toggleTask);

export default router;