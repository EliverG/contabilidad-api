// routes/PeriodoRoutes.ts
import { Router } from 'express';
import { PeriodoController } from '../controllers/PeriodoController';

const periodoController = new PeriodoController();
const router = Router();

router.get('/all', (req, res) => periodoController.getAll(req, res));

export default router;