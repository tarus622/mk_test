import { UserData } from '../types/UserData';
import { UserPermission } from 'src/enums/user-permission.enum';

export interface IUserRepository {
  create(email: string, password: string, role: UserPermission): UserData;
  getAll(): Partial<UserData>[];
  findByEmail(email: string): UserData | null;
  findById(id: string): UserData | null;
  updatePermission(id: string, permission: string): Partial<UserData> | null;
  updateRefreshToken(id: string, token: string): Partial<UserData>;
  revokeToken(id: string): Partial<UserData>;
}
