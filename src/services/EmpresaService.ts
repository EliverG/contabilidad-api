import { Empresa } from "../entities/Empresa";
import { EmpresaRepository } from "../repositories/EmpresaRepository";

export class EmpresaService {
private empresaRepository = new EmpresaRepository();

async getAll(): Promise<Empresa[]> {
return await this.empresaRepository.findAll();
}

async getById(id: number): Promise<Empresa | null> {
return await this.empresaRepository.findById(id);
}

async create(data: Empresa): Promise<Empresa> {
// Validaciones mínimas de negocio
if (!data?.nombre?.trim()) {
    throw new Error("El nombre es requerido");
}
if (!data?.rucNit?.trim()) {
    throw new Error("El RUC/NIT es requerido");
}
return await this.empresaRepository.save(data);
}

async remove(id: number): Promise<boolean> {
return await this.empresaRepository.remove(id);
}
}
