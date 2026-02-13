import * as expenseService from "./expense.service.js";

export const addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expense = await expenseService.addExpense(userId, req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { seasonId } = req.params;
    const expenses = await expenseService.getExpensesBySeason(userId, seasonId);
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};