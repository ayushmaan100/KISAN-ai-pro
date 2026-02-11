import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import { requireAuth } from './middleware/auth.middleware.js';

const router = Router();

// Public Routes
router.use('/auth', authRoutes);

// Protected Routes (Just a test for now)
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});


export default router;