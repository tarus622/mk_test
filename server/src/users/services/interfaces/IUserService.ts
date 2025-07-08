import { CreateUserData} from '../types/create-user-data';
import { PublicUserData} from '../types/public-user-data';
import { User } from 'src/users/entities/User';

export interface IUserService {
  create(data: CreateUserData): Promise<PublicUserData>;
  getAllUsers(): Promise<Partial<PublicUserData>[]>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findPublicByEmail(email: string): Promise<PublicUserData>;
  findPublicById(id: string): Promise<PublicUserData>;
}
