import { Router } from 'express';
import { CierreContableController } from '../controllers/cierreContableController';

const cierreContableController = new CierreContableController();
const router = Router();

// Normaliza/valida :id a nivel de router (opcional)
router.param('id', (req, res, next, value) => {
  const id = Number(value);
  if (!Number.isFinite(id)) {
    res.status(400).json({ message: "id inválido" });
    return;
  }
  (req as any).idNum = id; // si quieres reutilizarlo
  next();
});

router.get('/all', cierreContableController.getAll);
router.get('/:id', cierreContableController.getById);
router.post('/new', cierreContableController.create);
router.put('/:id', cierreContableController.update);
router.delete('/:id', cierreContableController.remove);

// NUEVOS ENDPOINTS PARA EL FRONTEND
router.post('/validar', cierreContableController.validate);
router.get('/previsualizar', cierreContableController.preview);
router.post('/cerrar', cierreContableController.close);
router.post('/reabrir', cierreContableController.reopen);

export default router;