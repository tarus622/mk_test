import { CreateUserDto } from '../types/create-user-data';
import { PublicUserDto } from '../types/public-user-data';

export interface IUserService {
  create(data: CreateUserDto): Promise<PublicUserDto>;
  getAllUsers(): PublicUserDto[];
  findPublicByEmail(email: string): PublicUserDto | null;
  findPublicById(id: string): PublicUserDto | null;
}
