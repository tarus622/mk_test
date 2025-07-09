import { HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CreateUserData } from './types/CreateUserData';
import { PublicUserData } from './types/PublicUserData';
import { UserPermission } from '../../../enums/user-permission.enum';
import * as bcrypt from 'bcrypt';
import { IUserService } from './interfaces/IUserService';
import { I18nService } from 'nestjs-i18n';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserData } from './types/UserData';

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
      id: newUser.id,
      email: newUser.email,
      refresh_token: newUser.refresh_token || null,
    };
  }

  async getAllUsers(): Promise<Partial<PublicUserData>[]> {
    const cachedUsers: PublicUserData[] | null =
      (await this.cacheManager.get('users:all')) || null;

    if (cachedUsers) return cachedUsers;

    const users: Partial<UserData>[] = this.usersRepository.getAll();

    const mappedUsers = users.map((user: Partial<UserData>) => {
      return {
        id: user.id,
        email: user.email,
      };
    });

    if (mappedUsers.length)
      await this.cacheManager.set('users:all', mappedUsers);

    return mappedUsers;
  }

  async findById(id: string): Promise<UserData> {
    const cachedUser: UserData | null =
      (await this.cacheManager.get(`users:id:${id}`)) || null;

    if (cachedUser) return cachedUser;

    const user = this.usersRepository.findById(id);

    if (!user) {
      throw new HttpException(this.i18n.t('users.USER_NOT_FOUND'), 404);
    }

    await this.cacheManager.set(`users:id:${id}`, user);

    return user;
  }

  async findByEmail(email: string): Promise<UserData> {
    const cachedUser: UserData | null =
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
      id: user.id,
      email: user.email,
      refresh_token: user.refresh_token || null,
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
      id: user.id,
      email: user.email,
      refresh_token: user.refresh_token || null,
    };

    await this.cacheManager.set(`users:public:email:${email}`, publicUser);

    return publicUser;
  }

  async updateRefreshToken(id: string, token: string): Promise<string> {
    const user = this.usersRepository.updateRefreshToken(id, token);

    await Promise.all([
      this.cacheManager.del(`users:public:email:${user.email}`),
      this.cacheManager.del(`users:public:id:${user.id}`),
      this.cacheManager.del(`users:email:${user.email}`),
      this.cacheManager.del(`users:id:${user.id}`),
    ]);

    return user.refresh_token as string;
  }

  async revokeToken(id: string): Promise<void> {
    const user = this.usersRepository.revokeToken(id);

    await Promise.all([
      this.cacheManager.del(`users:public:email:${user.email}`),
      this.cacheManager.del(`users:public:id:${user.id}`),
      this.cacheManager.del(`users:email:${user.email}`),
      this.cacheManager.del(`users:id:${user.id}`),
    ]);
  }
}
