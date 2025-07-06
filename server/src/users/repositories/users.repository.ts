import { HttpException, Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { v4 as uuid } from 'uuid';
import { IUserRepository } from './interfaces/IUserRepository';

@Injectable()
export class UsersRepository implements IUserRepository {
  private users: User[] = [];

  create(email: string, password: string): User {
    const user = new User(uuid(), email, password);
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

  updateRefreshToken(id: string, token: string): string | null {
    const user = this.users.find((user: User) => user.getId() === id);
    if (!user) throw new HttpException('User not found', 404);

    user.setRefreshToken(token);
    return user.getRefreshToken() || null;
  }
}
