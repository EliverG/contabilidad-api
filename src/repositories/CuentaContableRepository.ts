import { AppDataSource } from "../data-source";
import { CuentaContable } from "../entities/CuentaContable";

export class CuentaContableRepository {
  private repository = AppDataSource.getRepository(CuentaContable);

  async findAll(): Promise<CuentaContable[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<CuentaContable | null> {
    return await this.repository.findOneBy({ id });
  }

  async save(user: CuentaContable): Promise<CuentaContable> {
    return await this.repository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
