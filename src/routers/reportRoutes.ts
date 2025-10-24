import { Router } from 'express';
import estadoController from '../controllers/EstadoResultadosController';

const router = Router();

router.get('/estado-resultados', estadoController.preview);
router.post('/estado-resultados/export', estadoController.export);

export default router;
