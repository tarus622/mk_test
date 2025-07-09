import { UserData } from '../../repositories/types/UserData';
import { CreateUserData } from '../types/CreateUserData';
import { PublicUserData } from '../types/PublicUserData';
import { User } from 'src/modules/users/entities/User';

export interface IUserService {
  create(data: CreateUserData): Promise<PublicUserData>;
  getAllUsers(): Promise<Partial<PublicUserData>[]>;
  findById(id: string): Promise<UserData>;
  findByEmail(email: string): Promise<UserData>;
  findPublicByEmail(email: string): Promise<PublicUserData>;
  findPublicById(id: string): Promise<PublicUserData>;
  updateRefreshToken(id: string, token: string): Promise<string>;
  revokeToken(id: string): Promise<void>;
}
