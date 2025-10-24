import { Router } from 'express';
import { LibroDiarioController } from '../controllers/LibroDiarioController';

const libroDiarioController = new LibroDiarioController()
const router = Router();

router.get('/all', libroDiarioController.getAll);
router.get('/:id', libroDiarioController.getById);
router.post('/new', libroDiarioController.create);
router.delete('/:id', libroDiarioController.remove); 

export default router;
