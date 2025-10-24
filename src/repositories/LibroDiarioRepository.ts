import { AppDataSource } from '../data-source';
import { LibroDiario } from '../entities/LibroDiario';

export class LibroDiarioRepository {
private repository = AppDataSource.getRepository(LibroDiario);

async findAll(): Promise<LibroDiario[]> {
return await this.repository.find();
}

async findById(id: number): Promise<LibroDiario | null> {
return await this.repository.findOneBy({ id });
}

async save(empresa: LibroDiario): Promise<LibroDiario> {
return await this.repository.save(empresa);
}

async remove(id: number): Promise<boolean> {
const result = await this.repository.delete(id);
return result.affected !== 0;
}
}

