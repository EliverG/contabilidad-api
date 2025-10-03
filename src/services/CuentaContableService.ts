import { CuentaContable } from "../entities/CuentaContable";
import { CuentaContableRepository } from "../repositories/CuentaContableRepository";


export class CuentaContableService {
    private cuentaContableRepository = new CuentaContableRepository()

  async getAll(): Promise<CuentaContable[]> {
    return await this.cuentaContableRepository.findAll();
  }

  async getById(id: number): Promise<CuentaContable | null> {
    return await this.cuentaContableRepository.findById(id);
  }

  async create(data: CuentaContable): Promise<CuentaContable> {
    return await this.cuentaContableRepository.save(data);
  }

  async remove(id: number): Promise<boolean> {
    return await this.cuentaContableRepository.remove(id);
  }
}
