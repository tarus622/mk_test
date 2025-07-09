import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { v4 as uuid } from 'uuid';
import { IUserRepository } from './interfaces/IUserRepository';
import { I18nService } from 'nestjs-i18n';
import { UserPermission } from 'src/enums/user-permission.enum';
import { UserData } from './types/UserData';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private i18n: I18nService) {}
  private users: User[] = [];

  create(
    email: string,
    password: string,
    permission: UserPermission,
  ): UserData {
    const user = new User(uuid(), email, password, permission);
    this.users.push(user);
    return {
      id: user.getId(),
      email: user.getEmail(),
      password: user.getPassword(),
      refresh_token: user.getRefreshToken(),
      permission: user.getPermission(),
    };
  }

  getAll(): Partial<UserData>[] {
    const users = this.users.map((user: User) => {
      return {
        id: user.getId(),
        email: user.getEmail(),
        refresh_token: user.getRefreshToken(),
        permission: user.getPermission(),
      };
    });
    return users;
  }

  findByEmail(email: string): UserData | null {
    const user = this.users.find((user: User) => user.getEmail() === email);

    if (!user) return null;

    return {
      id: user.getId(),
      email: user.getEmail(),
      password: user.getPassword(),
      refresh_token: user.getRefreshToken(),
      permission: user.getPermission(),
    };
  }

  findById(id: string): UserData | null {
    const user = this.users.find((user: User) => user.getId() === id);

    if (!user) return null;

    return {
      id: user.getId(),
      email: user.getEmail(),
      password: user.getPassword(),
      refresh_token: user.getRefreshToken(),
      permission: user.getPermission(),
    };
  }

  updatePermission(id: string, permission: string): Partial<UserData> {
    const user = this.users.find((user: User) => user.getId() === id) || null;
    if (!user)
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);

    user.setPermission(permission);

    return {
      id: user.getId(),
      email: user.getEmail(),
      permission: user.getPermission(),
    };
  }

  updateRefreshToken(id: string, token: string): Partial<UserData> {
    const user = this.users.find((user: User) => user.getId() === id) || null;
    if (!user)
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);

    user.setRefreshToken(token);

    return {
      id: user.getId(),
      email: user.getEmail(),
      refresh_token: user.getRefreshToken(),
      permission: user.getPermission(),
    };
  }

  revokeToken(id: string): Partial<UserData> {
    const user = this.users.find((user: User) => user.getId() === id) || null;
    if (!user)
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);

    user.revokeToken();

    return {
      id: user.getId(),
      email: user.getEmail(),
      refresh_token: user.getRefreshToken(),
      permission: user.getPermission(),
    };
  }
}
