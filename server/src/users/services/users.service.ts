import { HttpException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserData } from './types/create-user-data';
import { PublicUserData } from './types/public-user-data';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import { IUserService } from './interfaces/IUserService';

@Injectable()
export class UsersService implements IUserService {
  constructor(private usersRepository: UsersRepository) {}

  async create(data: CreateUserData): Promise<PublicUserData> {
    const userAlreadyExists = this.usersRepository.findByEmail(data.email);

    if (userAlreadyExists) throw new HttpException('User already exists', 409);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = this.usersRepository.create(data.email, hashedPassword);

    return {
      id: newUser.getId(),
      email: newUser.getEmail(),
      refresh_token: newUser.getRefreshToken() || null,
    };
  }

  getAllUsers(): PublicUserData[] {
    const users = this.usersRepository.getAll();

    return users.map((user: User) => {
      return {
        id: user.getId(),
        email: user.getEmail(),
        refresh_token: user.getRefreshToken() || null,
      };
    });
  }

  findById(id: string): User {
    const user = this.usersRepository.findById(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  findByEmail(email: string): User | null {
    const user = this.usersRepository.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  findPublicById(id: string): PublicUserData {
    const user = this.usersRepository.findById(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      id: user.getId(),
      email: user.getEmail(),
      refresh_token: user.getRefreshToken() || null,
    };
  }

  findPublicByEmail(email: string): PublicUserData | null {
    const user = this.usersRepository.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      id: user.getId(),
      email: user.getEmail(),
      refresh_token: user.getRefreshToken() || null,
    };
  }

  updateRefreshToken(id: string, token: string): string | null {
    const updatedToken = this.usersRepository.updateRefreshToken(id, token);

    return updatedToken;
  }
}
