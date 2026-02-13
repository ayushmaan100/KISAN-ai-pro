import { Router } from "express";
import * as expenseController from "./expense.controller.js";

const router = Router();

router.post("/", expenseController.addExpense);
router.get("/:seasonId", expenseController.getExpenses);

export default router;