import { PeriodoContable } from "../entities/PeriodoContable";
import { PeriodoContableRepository } from "../repositories/PeriodoContableRepository";

export class PeriodoContableService {
private periodoRepository = new PeriodoContableRepository();

async getAll(): Promise<PeriodoContable[]> {
return await this.periodoRepository.findAll();
}

async getById(id: number): Promise<PeriodoContable | null> {
return await this.periodoRepository.findById(id);
}

async create(data: PeriodoContable): Promise<PeriodoContable> {
// Validaciones mínimas
if (!data?.idEmpresa) {
    throw new Error("La empresa es requerida");
}
if (!data?.nombrePeriodo?.trim()) {
    throw new Error("El nombre del período es requerido");
}
if (!data?.fechaInicio || !data?.fechaFin) {
    throw new Error("Las fechas inicio y fin son requeridas");
}

// Normalizar/validar fechas (acepta ISO 'YYYY-MM-DD' desde Postman)
const ini = new Date(data.fechaInicio);
const fin = new Date(data.fechaFin);
if (isNaN(ini.getTime()) || isNaN(fin.getTime())) {
    throw new Error("Formato de fecha inválido (use ISO: YYYY-MM-DD)");
}
if (fin < ini) {
    throw new Error("La fecha_fin no puede ser menor que fecha_inicio");
}

const toSave: PeriodoContable = {
    ...data,
    fechaInicio: ini,
    fechaFin: fin
};

return await this.periodoRepository.save(toSave);
}

async remove(id: number): Promise<boolean> {
return await this.periodoRepository.remove(id);
}
}
