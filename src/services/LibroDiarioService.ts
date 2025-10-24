import { CuentaContable } from "../entities/CuentaContable";
import { LibroDiario } from "../entities/LibroDiario";
import { LibroDiarioRepository } from "../repositories/LibroDiarioRepository";


export class LibroDiarioService {
    private diarioRepository = new LibroDiarioRepository()

  async getAll(): Promise<LibroDiario[]> {
    return await this.diarioRepository.findAll();
  }

  async getById(id: number): Promise<LibroDiario | null> {
    return await this.diarioRepository.findById(id);
  }

  async create(data: LibroDiario): Promise<LibroDiario> {
    return await this.diarioRepository.save(data);
  }

  async remove(id: number): Promise<boolean> {
    return await this.diarioRepository.remove(id);
  }
}
