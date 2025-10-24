import { RequestHandler } from "express";
import { CierreContableService } from "../services/cierreContableService";

const service = new CierreContableService();

export class CierreContableController {
  // Listar
  getAll: RequestHandler = async (_req, res) => {
    const cierres = await service.getAll();
    res.json(cierres);
  };

  // Obtener por id
  getById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "id inválido" });
      return;
    }
    const cierre = await service.getById(id);
    if (!cierre) {
      res.status(404).json({ message: "Cierre contable no encontrado" });
      return;
    }
    res.json(cierre);
  };

  // Crear
  create: RequestHandler = async (req, res) => {
    try {
      const nuevo = await service.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ message: "Error al crear cierre contable", error });
    }
  };

  // Actualizar
  update: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "id inválido" });
      return;
    }
    try {
      const actualizado = await service.update(id, req.body);
      if (!actualizado) {
        res.status(404).json({ message: "Cierre contable no encontrado" });
        return;
      }
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ message: "Error al actualizar cierre contable", error });
    }
  };

  // Eliminar
  remove: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "id inválido" });
      return;
    }
    try {
      const ok = await service.remove(+req.params.id);
      if (!ok) {
        res.status(404).json({ message: "Cierre contable no encontrado" });
        return;
      }
      res.json({ message: "Registro eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error en BD", error });
    }
  };

  // Validar un período antes de cerrar
  validate: RequestHandler = async (req, res, _next) => {
    try {
      const { idPeriodo } = req.body;
      const result = await service.validatePeriodo(Number(idPeriodo));
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Error al validar período", error });
    }
  };

  // Previsualizar ajustes/asientos de cierre
  preview: RequestHandler = async (req, res, _next) => {
    try {
      const idPeriodo = Number(req.query.idPeriodo);
      const result = await service.previsualizar(idPeriodo);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Error al previsualizar cierre", error });
    }
  };

  // Cerrar período
  close: RequestHandler = async (req, res, _next) => {
    try {
      const { idPeriodo, generarAsiento, idUsuario, tipo } = req.body;
      if (!idUsuario) {
        res.status(400).json({ message: "idUsuario es requerido para cerrar" });
        return;
      }
      const result = await service.cerrar({
        idPeriodo: Number(idPeriodo),
        idUsuario: Number(idUsuario),
        generarAsiento: Boolean(generarAsiento),
        tipo: (tipo as string) || "MENSUAL",
      });
      res.status(201).json(result);
    } catch (error: any) {
      const status = error?.status ?? 400;
      res.status(status).json({ message: "Error al cerrar período", error: error?.data ?? error });
    }
  };

  // Reabrir período
  reopen: RequestHandler = async (req, res, _next) => {
    try {
      const { idPeriodo } = req.body;
      const ok = await service.reabrir(Number(idPeriodo));
      if (!ok) {
        res.status(404).json({ message: "Cierre no encontrado para el período" });
        return;
      }
      res.json({ message: "Período reabierto" });
    } catch (error) {
      res.status(400).json({ message: "Error al reabrir período", error });
    }
  };
}