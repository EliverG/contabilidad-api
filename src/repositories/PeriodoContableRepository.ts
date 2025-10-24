import { AppDataSource } from "../data-source";
import { PeriodoContable } from "../entities/PeriodoContable";

export class PeriodoContableRepository {
private repository = AppDataSource.getRepository(PeriodoContable);

async findAll(): Promise<PeriodoContable[]> {
return await this.repository.find();
}

async findById(id: number): Promise<PeriodoContable | null> {
return await this.repository.findOneBy({ id });
}

async save(periodo: PeriodoContable): Promise<PeriodoContable> {
return await this.repository.save(periodo);
}

async remove(id: number): Promise<boolean> {
const result = await this.repository.delete(id);
return result.affected !== 0;
}
}
