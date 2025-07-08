import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { v4 as uuid } from 'uuid';
import { IUserRepository } from './interfaces/IUserRepository';
import { I18nService } from 'nestjs-i18n';
import { UserPermission } from 'src/enums/user-permission.enum';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private i18n: I18nService) {}
  private users: User[] = [];

  create(email: string, password: string, permission: UserPermission): User {
    const user = new User(uuid(), email, password, permission);
    this.users.push(user);
    return user;
  }

  getAll(): User[] {
    return this.users;
  }

  findByEmail(email: string): User | null {
    const user = this.users.find((user: User) => user.getEmail() === email);

    if (!user) return null;

    return user;
  }

  findById(id: string): User | null {
    const user = this.users.find((user: User) => user.getId() === id);

    if (!user) return null;

    return user;
  }

  updatePermission(id: string, permission: string): User {
    const user = this.users.find((user: User) => user.getId() === id) || null;
    if (!user)
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);

    user.setPermission(permission);

    return user;
  }

  updateRefreshToken(id: string, token: string): User {
    const user = this.users.find((user: User) => user.getId() === id) || null;
    if (!user)
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);

    user.setRefreshToken(token);

    return user;
  }

  revokeToken(id: string): User {
    const user = this.users.find((user: User) => user.getId() === id) || null;
    if (!user)
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);

    user.revokeToken();

    return user;
  }
}
