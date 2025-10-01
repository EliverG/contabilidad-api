
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";


export class UserRepository {
  private repository = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }
}
