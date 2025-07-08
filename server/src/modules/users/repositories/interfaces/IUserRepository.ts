import { User } from "src/modules/users/entities/User";

export interface IUserRepository {
  create(email: string, password: string): User;
  findByEmail(email: string): User | null;
  findById(id: string): User | null;
}
