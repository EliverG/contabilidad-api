import { Request, Response } from "express";
import { EmpresaService } from "../services/EmpresaService";

const service = new EmpresaService();

export class EmpresaController {
async getAll(req: Request, res: Response) {
const empresas = await service.getAll();
res.json(empresas);
}

async getById(req: Request, res: Response): Promise<void> {
const empresa = await service.getById(+req.params.id);
if (!empresa) {
    res.status(404).json({ message: "Empresa no encontrada" });
} else {
    res.json(empresa);
}
}

async create(req: Request, res: Response) {
try {
    const nuevaEmpresa = await service.create(req.body);
    res.status(201).json(nuevaEmpresa);
} catch (error: any) {
    res.status(400).json({
    message: "Error al crear empresa",
    error: error?.message ?? error
    });
}
}

async remove(req: Request, res: Response) {
try {
    const eliminado = await service.remove(+req.params.id);
    if (!eliminado) {
    res.status(404).json({ message: "Empresa no encontrada" });
    } else {
    res.status(200).json({ message: "Registro eliminado con id: " + req.params.id });
    }
} catch (error) {
    res.status(500).json({ message: "Error en BD" }).send();
}
}
}
