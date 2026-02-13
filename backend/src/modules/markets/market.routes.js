import { Router } from 'express';
import * as marketController from './market.controller.js';

const router = Router();

router.get('/', marketController.getMarketPrices);

export default router;