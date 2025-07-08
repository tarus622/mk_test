import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserData } from './types/create-user-data';
import { PublicUserData } from './types/public-user-data';
import { UserPermission } from 'src/enums/user-permission.enum';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import { IUserService } from './interfaces/IUserService';
import { I18nService } from 'nestjs-i18n';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private usersRepository: UsersRepository,
    private i18n: I18nService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: CreateUserData): Promise<PublicUserData> {
    const userAlreadyExists = this.usersRepository.findByEmail(data.email);

    if (userAlreadyExists)
      throw new HttpException(this.i18n.t('users.USER_ALREADY_EXISTS'), 409);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = this.usersRepository.create(
      data.email,
      hashedPassword,
      UserPermission.USER,
    );

    return {
      id: newUser.getId(),
      email: newUser.getEmail(),
      refresh_token: newUser.getRefreshToken() || null,
    };
  }

  async getAllUsers(): Promise<Partial<PublicUserData>[]> {
    const cachedUsers: PublicUserData[] | null =
      (await this.cacheManager.get('users:all')) || null;

    if (cachedUsers) return cachedUsers;

    const users = this.usersRepository.getAll();

    const mappedUsers = users.map((user: User) => {
      return {
        id: user.getId(),
        email: user.getEmail(),
      };
    });

    if (mappedUsers.length)
      await this.cacheManager.set('users:all', mappedUsers);

    return mappedUsers;
  }

  async findById(id: string): Promise<User> {
    const cachedUser: User | null =
      (await this.cacheManager.get(`users:id:${id}`)) || null;

    if (cachedUser) return cachedUser;

    const user = this.usersRepository.findById(id);

    if (!user) {
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);
    }

    await this.cacheManager.set(`users:id:${id}`, user);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const cachedUser: User | null =
      (await this.cacheManager.get(`users:email:${email}`)) || null;

    if (cachedUser) return cachedUser;

    const user = this.usersRepository.findByEmail(email);

    if (!user) {
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);
    }

    await this.cacheManager.set(`users:email:${email}`, user);

    return user;
  }

  async findPublicById(id: string): Promise<PublicUserData> {
    const cachedPublicUser: PublicUserData | null =
      (await this.cacheManager.get(`users:public:id:${id}`)) || null;

    if (cachedPublicUser) return cachedPublicUser;

    const user = this.usersRepository.findById(id);

    if (!user) {
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);
    }

    const publicUser: PublicUserData = {
      id: user.getId(),
      email: user.getEmail(),
      refresh_token: user.getRefreshToken() || null,
    };

    await this.cacheManager.set(`users:public:id:${id}`, publicUser);

    return publicUser;
  }

  async findPublicByEmail(email: string): Promise<PublicUserData> {
    const cachedPublicUser: PublicUserData | null =
      (await this.cacheManager.get(`users:public:email:${email}`)) || null;

    if (cachedPublicUser) return cachedPublicUser;

    const user = this.usersRepository.findByEmail(email);

    if (!user) {
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);
    }

    const publicUser: PublicUserData = {
      id: user.getId(),
      email: user.getEmail(),
      refresh_token: user.getRefreshToken() || null,
    };

    await this.cacheManager.set(`users:public:email:${email}`, publicUser);

    return publicUser;
  }

  async updateRefreshToken(id: string, token: string): Promise<string> {
    const user = this.usersRepository.updateRefreshToken(id, token);

    await Promise.all([
      this.cacheManager.del(`users:public:email:${user.getEmail()}`),
      this.cacheManager.del(`users:public:id:${user.getId()}`),
      this.cacheManager.del(`users:email:${user.getEmail()}`),
      this.cacheManager.del(`users:id:${user.getId()}`),
    ]);

    return user.getRefreshToken() as string;
  }

  async revokeToken(id: string): Promise<void> {
    const user = this.usersRepository.revokeToken(id);

    await Promise.all([
      this.cacheManager.del(`users:public:email:${user.getEmail()}`),
      this.cacheManager.del(`users:public:id:${user.getId()}`),
      this.cacheManager.del(`users:email:${user.getEmail()}`),
      this.cacheManager.del(`users:id:${user.getId()}`),
    ]);
  }
}
