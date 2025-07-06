import { HttpException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import { IUserService } from './interfaces/IUserService';

@Injectable()
export class UsersService implements IUserService {
  constructor(private userRepository: UsersRepository) {}

  async create(data: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = this.userRepository.create(data.email, hashedPassword);

    return newUser;
  }

  findById(id: string): User {
    const user = this.userRepository.findById(id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  findByEmail(email: string): User | null {
    const user = this.userRepository.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }

  updateRefreshToken(id: string, token: string): string {
    const updatedToken = this.userRepository.updateRefreshToken(id, token);

    return updatedToken;
  }
}
