import { User } from 'src/users/entities/User';
import { CreateUserDto } from '../dtos/create-user.dto';

export interface IUserService {
  create(data: CreateUserDto): Promise<User>;
  findByEmail(email: string): User | null;
  findById(id: string): User | null;
}
