import { Request, Response } from "express";
import { CuentaContableService } from "../services/CuentaContableService";

const service = new CuentaContableService();

export class CuentaContableController {
  async getAll(req: Request, res: Response) {
    const cuentas = await service.getAll();
    res.json(cuentas);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const cuenta = await service.getById(+req.params.id);
    if (!cuenta){
      res.status(404).json({ message: "Cuenta no encontrada" });
    }else{
      res.json(cuenta);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const nuevaCuenta = await service.create(req.body);
      res.status(201).json(nuevaCuenta);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error al crear cuenta contable", error });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const eliminado = await service.remove(+req.params.id);
      if (!eliminado) {
        res.status(404).json({ message: "Cuenta no encontrada" });
      }else{
        res
        .status(200)
        .json({ message: "Registro eliminado con id: " + req.params.id });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en BD" }).send();
    }
  }
}
