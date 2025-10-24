import { AppDataSource } from "../data-source";
import { CierreContable } from "../entities/cierreContable";

export class CierreContableRepository {
  private repository = AppDataSource.getRepository(CierreContable);

  async findAll(): Promise<CierreContable[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<CierreContable | null> {
    if (!Number.isFinite(id)) return null;
    return await this.repository.findOneBy({ id });
  }

  async findByPeriodo(idPeriodo: number): Promise<CierreContable | null> {
    return await this.repository.findOne({ where: { idPeriodo } });
  }

  async deleteByPeriodo(idPeriodo: number): Promise<boolean> {
    const result = await this.repository.delete({ idPeriodo } as any);
    return (result.affected ?? 0) > 0;
  }

  async save(data: CierreContable): Promise<CierreContable> {
    return await this.repository.save(data);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }

  async update(
    id: number,
    data: Partial<CierreContable>
  ): Promise<CierreContable | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }
}

// router.put('/:id', cierreContableController.update);