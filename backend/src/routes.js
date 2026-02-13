import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import { requireAuth } from './middleware/auth.middleware.js';
import farmRoutes from './modules/farms/farm.routes.js';
import * as farmController from './modules/farms/farm.controller.js';
import seasonRoutes from "./modules/seasons/season.routes.js"; 
import taskRoutes from "./modules/tasks/task.routes.js";
import expenseRoutes from "./modules/expenses/expense.routes.js"; 
import weatherRoutes from "./modules/weather/weather.routes.js";
import marketRoutes from "./modules/markets/market.routes.js"; // <--- Import

const router = Router();

// Public Routes
router.use('/auth', authRoutes);

// Protected Routes (Just a test for now)
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user }); 
});

// Farm Routes (Protected)
router.use('/farms', requireAuth, farmRoutes);
router.use("/seasons", requireAuth, seasonRoutes); 
router.use("/tasks", requireAuth, taskRoutes); 
router.use("/expenses", requireAuth, expenseRoutes); 
router.use("/weather", weatherRoutes); 
router.use("/markets", marketRoutes); // <--- Add this




export default router;