import { Router } from 'express';
import { EmpresaController } from '../controllers/EmpresaController';

const empresaController = new EmpresaController();
const router = Router();

router.get('/all', empresaController.getAll);
router.get('/:id', empresaController.getById);
router.post('/new', empresaController.create);
router.delete('/:id', empresaController.remove);

export default router;
