import { Request, Response } from "express";
import { PeriodoContableService } from "../services/PeriodoContableService";

const service = new PeriodoContableService();

export class PeriodoContableController {
async getAll(req: Request, res: Response) {
const periodos = await service.getAll();
res.json(periodos);
}

async getById(req: Request, res: Response): Promise<void> {
const periodo = await service.getById(+req.params.id);
if (!periodo) {
    res.status(404).json({ message: "Período contable no encontrado" });
} else {
    res.json(periodo);
}
}

async create(req: Request, res: Response) {
try {
    const nuevo = await service.create(req.body);
    res.status(201).json(nuevo);
} catch (error: any) {
    res.status(400).json({
    message: "Error al crear período contable",
    error: error?.message ?? error
    });
}
}

async remove(req: Request, res: Response) {
try {
    const eliminado = await service.remove(+req.params.id);
    if (!eliminado) {
    res.status(404).json({ message: "Período contable no encontrado" });
    } else {
    res
        .status(200)
        .json({ message: "Registro eliminado con id: " + req.params.id });
    }
} catch (error) {
    res.status(500).json({ message: "Error en BD" }).send();
}
}
}
