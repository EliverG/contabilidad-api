import { Request, Response } from "express";
import { LibroDiarioService } from "../services/LibroDiarioService";

const service = new LibroDiarioService();

export class LibroDiarioController {
  async getAll(req: Request, res: Response) {
    const diario = await service.getAll();
    res.json(diario);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const diario = await service.getById(+req.params.id);
    if (!diario){
      res.status(404).json({ message: "libro diario no encontrada" });
    }else{
      res.json(diario);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const nuevoLibro = await service.create(req.body);
      res.status(201).json(nuevoLibro);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error al crear libro diario contable", error });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const eliminado = await service.remove(+req.params.id);
      if (!eliminado) {
        res.status(404).json({ message: "libro diario no encontrada" });
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
