import { Router } from 'express';
import { PeriodoContableController } from '../controllers/PeriodoContableController';

const periodoContableController = new PeriodoContableController();
const router = Router();

router.get('/all', periodoContableController.getAll);
router.get('/:id', periodoContableController.getById);
router.post('/new', periodoContableController.create);
router.delete('/:id', periodoContableController.remove);

export default router;
