import { Request, Response } from "express";
import { AsientoContableService } from "../services/AsientoContableService";

const service = new AsientoContableService();

export class AsientoContableController {
  updateEstado(arg0: string, updateEstado: any) {
      throw new Error('Method not implemented.');
  }
  static update(arg0: string, update: any) {
      throw new Error('Method not implemented.');
  }
  async getAll(req: Request, res: Response) {
    try {
      const asientos = await service.getAll();
      res.json(asientos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los asientos contables", error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const asiento = await service.getById(+req.params.id);
      if (!asiento) {
        res.status(404).json({ message: "Asiento contable no encontrado" });
      } else {
        res.json(asiento);
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el asiento contable", error });
    }
  }

  async getByNumeroAsiento(req: Request, res: Response): Promise<void> {
    try {
      const asiento = await service.getByNumeroAsiento(req.params.numero);
      if (!asiento) {
        res.status(404).json({ message: "Asiento contable no encontrado" });
      } else {
        res.json(asiento);
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el asiento contable", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const nuevoAsiento = await service.create(req.body);
      res.status(201).json(nuevoAsiento);
    } catch (error: any) {
      res.status(400).json({ 
        message: "Error al crear asiento contable", 
        error: error.message 
      });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const eliminado = await service.remove(+req.params.id);
      if (!eliminado) {
        res.status(404).json({ message: "Asiento contable no encontrado" });
      } else {
        res.status(200).json({ 
          message: "Asiento contable eliminado con id: " + req.params.id 
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en BD" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = +req.params.id;
      const asientoData = req.body;

      console.log('📥 Recibiendo solicitud UPDATE para ID:', id);
      console.log('📝 Datos recibidos:', asientoData);

      if (isNaN(id) || id <= 0) {
        res.status(400).json({ message: "ID de asiento inválido" });
        return;
      }

      const asientoActualizado = await service.update(id, asientoData);
      
      if (!asientoActualizado) {
        res.status(404).json({ message: "Asiento contable no encontrado" });
        return;
      }

      console.log('✅ Asiento actualizado exitosamente:', asientoActualizado);
      res.json(asientoActualizado);
    } catch (error: any) {
      console.error('❌ Error en update controller:', error);
      res.status(400).json({ 
        message: "Error al actualizar el asiento contable", 
        error: error.message 
      });
    }
  }
}