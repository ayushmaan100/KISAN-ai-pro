import { Router } from 'express';
import * as weatherController from './weather.controller.js';

const router = Router();

// Public route (or protected, depending on preference)
// Usage: GET /api/v1/weather/Patna
router.get('/:district', weatherController.getWeather);

export default router;