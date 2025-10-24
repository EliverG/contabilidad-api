import { Router, Request, Response, NextFunction } from "express";
import { LibroMayorController } from "../controllers/LibroMayorController";

const router = Router();
const controller = new LibroMayorController();

// ✅ Opción segura: envolver y propagar errores a next()
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  controller.get(req, res).catch(next);
});

export default router;
