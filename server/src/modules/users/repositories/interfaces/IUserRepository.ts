import { User } from 'src/modules/users/entities/User';
import { UserPermission } from 'src/enums/user-permission.enum';

export interface IUserRepository {
  create(email: string, password: string, role: UserPermission): User;
  getAll(): User[];
  findByEmail(email: string): User | null;
  findById(id: string): User | null;
  updatePermission(id: string, permission: string): User | null;
  updateRefreshToken(id: string, token: string): User;
  revokeToken(id: string): User;
}
