import { User } from "../entities/User";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
