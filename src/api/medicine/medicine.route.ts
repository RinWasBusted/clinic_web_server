import { Router } from 'express';

const medicineRouter = Router();

import medicineItemsRouter from './items/medicine-items.route.js';

medicineRouter.use('/items', medicineItemsRouter);

export default medicineRouter;
