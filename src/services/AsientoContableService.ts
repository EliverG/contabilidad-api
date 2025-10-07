import { AsientoContable } from "../entities/AsientoContable";
import { AsientoContableRepository } from "../repositories/AsientoContableRepository";

export class AsientoContableService {
    private asientoContableRepository = new AsientoContableRepository()

  async getAll(): Promise<AsientoContable[]> {
    return await this.asientoContableRepository.findAll();
  }

  async getById(id: number): Promise<AsientoContable | null> {
    return await this.asientoContableRepository.findById(id);
  }

  async getByNumeroAsiento(numeroAsiento: string): Promise<AsientoContable | null> {
    return await this.asientoContableRepository.findByNumeroAsiento(numeroAsiento);
  }

  async create(data: AsientoContable): Promise<AsientoContable> {
    // Validar que el número de asiento no exista
    const existingAsiento = await this.getByNumeroAsiento(data.numeroAsiento);
    if (existingAsiento) {
      throw new Error("El número de asiento ya existe");
    }

    // Validar que débitos y créditos sean iguales
    if (data.totalDebito !== data.totalCredito) {
      throw new Error("El total débito debe ser igual al total crédito");
    }

    return await this.asientoContableRepository.save(data);
  }

  async remove(id: number): Promise<boolean> {
    return await this.asientoContableRepository.remove(id);
  }

  async updateEstado(id: number, estado: 'BORRADOR' | 'CONTABILIZADO' | 'ANULADO'): Promise<boolean> {
    return await this.asientoContableRepository.updateEstado(id, estado);
  }

  async update(id: number, data: Partial<AsientoContable>): Promise<AsientoContable | null> {
    console.log('🔄 Actualizando asiento con ID:', id);
    console.log('📝 Datos para actualizar:', data);

    // Validar que el asiento existe
    const existingAsiento = await this.getById(id);
    if (!existingAsiento) {
      throw new Error("El asiento contable no existe");
    }

    // Validar que débitos y créditos sean iguales si se están actualizando
    if (data.totalDebito !== undefined && data.totalCredito !== undefined) {
      if (data.totalDebito !== data.totalCredito) {
        throw new Error("El total débito debe ser igual al total crédito");
      }
    }

    // Validar que el número de asiento no exista (si se está actualizando)
    if (data.numeroAsiento && data.numeroAsiento !== existingAsiento.numeroAsiento) {
      const existingNumero = await this.getByNumeroAsiento(data.numeroAsiento);
      if (existingNumero) {
        throw new Error("El número de asiento ya existe");
      }
    }

    const resultado = await this.asientoContableRepository.update(id, data);
    console.log('✅ Asiento actualizado en servicio:', resultado);
    return resultado;
  }
}