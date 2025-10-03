import { Router } from 'express';
import { CuentaContableController } from '../controllers/CuentaContableController';

const cuentaContableController = new CuentaContableController()
const router = Router();

router.get('/all', cuentaContableController.getAll);
router.get('/:id', cuentaContableController.getById);
router.post('/new', cuentaContableController.create);
router.delete('/:id', cuentaContableController.remove); 

export default router;
