import { Router } from 'express';
const medicineRouter = Router();
import medicineItemsRouter from './items/medicine-items.route.js';
import medicineImexRouter from './imex/medicine-imex.route.js';
medicineRouter.use('/items', medicineItemsRouter);
medicineRouter.use('/imex', medicineImexRouter);
export default medicineRouter;
//# sourceMappingURL=medicine.route.js.map