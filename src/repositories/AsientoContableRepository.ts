import { AppDataSource } from "../data-source";
import { AsientoContable } from "../entities/AsientoContable";

export class AsientoContableRepository {
  private repository = AppDataSource.getRepository(AsientoContable);

  async findAll(): Promise<AsientoContable[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<AsientoContable | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByNumeroAsiento(numeroAsiento: string): Promise<AsientoContable | null> {
    return await this.repository.findOneBy({ numeroAsiento });
  }

  async save(asiento: AsientoContable): Promise<AsientoContable> {
    return await this.repository.save(asiento);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async updateEstado(id: number, estado: 'BORRADOR' | 'CONTABILIZADO' | 'ANULADO'): Promise<boolean> {
    const result = await this.repository.update(id, { estado });
    return result.affected !== 0;
  }

  async update(id: number, asientoData: Partial<AsientoContable>): Promise<AsientoContable | null> {
    try {
      console.log('🔄 Buscando asiento con ID:', id);
      const asiento = await this.repository.findOneBy({ id });
      
      if (!asiento) {
        console.log('❌ Asiento no encontrado con ID:', id);
        return null;
      }

      console.log('📝 Asiento encontrado:', asiento);
      console.log('🔄 Actualizando con datos:', asientoData);

      // Actualizar solo los campos que se proporcionan
      Object.assign(asiento, asientoData);
      
      const resultado = await this.repository.save(asiento);
      console.log('✅ Asiento guardado exitosamente:', resultado);
      return resultado;
    } catch (error) {
      console.error('❌ Error al actualizar asiento:', error);
      throw error;
    }
  }
}