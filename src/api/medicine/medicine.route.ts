import { Router } from 'express';

const medicineRouter = Router();

import medicineItemsRouter from './items/medicine-items.route.js';
import medicineImexRouter from './imex/medicine-imex.route.js';
import medicineTicketsRouter from './tickets/medicine-tickets.route.js';
import medicineUnitRouter from './items/medicine-unit.route.js';
import medicineUsageRouter from './items/medicine-usage.route.js';

medicineRouter.use('/items', medicineItemsRouter);
medicineRouter.use('/imex', medicineImexRouter);
medicineRouter.use('/tickets', medicineTicketsRouter);
medicineRouter.use('/units', medicineUnitRouter);
medicineRouter.use('/usages', medicineUsageRouter);

export default medicineRouter;


