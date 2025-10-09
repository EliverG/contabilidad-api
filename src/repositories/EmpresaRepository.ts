import { AppDataSource } from "../data-source";
import { Empresa } from "../entities/Empresa";

export class EmpresaRepository {
private repository = AppDataSource.getRepository(Empresa);

async findAll(): Promise<Empresa[]> {
return await this.repository.find();
}

async findById(id: number): Promise<Empresa | null> {
return await this.repository.findOneBy({ id });
}

async save(empresa: Empresa): Promise<Empresa> {
return await this.repository.save(empresa);
}

async remove(id: number): Promise<boolean> {
const result = await this.repository.delete(id);
return result.affected !== 0;
}
}
