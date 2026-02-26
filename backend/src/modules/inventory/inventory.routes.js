import { Router } from 'express';
import * as inventoryController from './inventory.controller.js';

const router = Router();

router.get('/', inventoryController.getInventory);
router.post('/', inventoryController.addItem);
router.delete('/:id', inventoryController.deleteItem);

export default router;