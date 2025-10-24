// routes/EmpresaRoutes.ts
import { Router } from 'express';
import { EmpresaController } from '../controllers/EmpresaController';

const empresaController = new EmpresaController();
const router = Router();

router.get('/all', (req, res) => empresaController.getAll(req, res));

export default router;