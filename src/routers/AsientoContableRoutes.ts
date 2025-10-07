{/*import { Router } from 'express';
import { AsientoContableController } from '../controllers/AsientoContableController';

const asientoContableController = new AsientoContableController();
const router = Router();

router.get('/all', asientoContableController.getAll);
router.get('/:id', asientoContableController.getById);
router.get('/numero/:numero', asientoContableController.getByNumeroAsiento);
router.post('/new', asientoContableController.create);
router.put('/:id', asientoContableController.update);
router.delete('/:id', asientoContableController.remove);
router.patch('/:id/estado', asientoContableController.updateEstado);

export default router;*/}

{/*import { Router } from 'express';
import { AsientoContableController } from '../controllers/AsientoContableController';

const asientoContableController = new AsientoContableController(); // <- CORREGIR ESTO
const router = Router();

router.get('/all', asientoContableController.getAll);
router.get('/:id', asientoContableController.getById);
router.get('/numero/:numero', asientoContableController.getByNumeroAsiento);
router.post('/new', asientoContableController.create);
router.put('/:id', AsientoContableController.update); // <- DEBE USAR asientoContableController
router.delete('/:id', asientoContableController.remove);
router.patch('/:id/estado', asientoContableController.updateEstado);

export default router;*/}

import { Router } from 'express';
import { AsientoContableController } from '../controllers/AsientoContableController';

const asientoContableController = new AsientoContableController();
const router = Router();

router.get('/all', asientoContableController.getAll);
router.get('/:id', asientoContableController.getById);
router.get('/numero/:numero', asientoContableController.getByNumeroAsiento);
router.post('/new', asientoContableController.create);
router.put('/:id', asientoContableController.update); // <- Usar bind
router.delete('/:id', asientoContableController.remove);
router.patch('/:id/estado', asientoContableController.updateEstado);

export default router;