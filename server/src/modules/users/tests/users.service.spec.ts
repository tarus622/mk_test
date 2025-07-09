import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { I18nService } from 'nestjs-i18n';
import { UsersRepository } from '../repositories/users.repository';
import { UserPermission } from '../../../enums/user-permission.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateUserData } from '../services/types/CreateUserData';
import { UserData } from '../services/types/UserData';
import { PublicUserData } from '../services/types/PublicUserData';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const mockUsersRepository = {
      create: jest.fn(),
      getAll: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updatePermission: jest.fn(),
      updateRefreshToken: jest.fn(),
      revokeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
            del: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn((key: string) => key),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('Should create a new user and return public user data of this user', async () => {
      // Arrange
      const createUserData: CreateUserData = {
        email: 'testemail@gmail.com',
        password: 'secret',
      };

      const userData: UserData = {
        id: 'unique',
        email: 'testemail@gmail.com',
        password: 'secret',
        refresh_token: null,
        permission: UserPermission.USER,
      };

      // Act
      (usersRepository.findByEmail as jest.Mock).mockReturnValue(null);

      (usersRepository.create as jest.Mock).mockReturnValue(userData);

      const user = await usersService.create(createUserData);

      // Assert
      expect(user).toEqual({
        id: userData.id,
        email: userData.email,
        refresh_token: userData.refresh_token,
      });
      expect(user.id).toBe(userData.id);
      expect(user.email).toBe(userData.email);
      expect(user.refresh_token).toBe(userData.refresh_token);
    });

    it('Should throw a 409 error if user already exists', async () => {
      try {
        // Arrange
        const createUserData: CreateUserData = {
          email: 'testemail@gmail.com',
          password: 'secret',
        };

        const userData: UserData = {
          id: 'unique',
          email: 'testemail@gmail.com',
          password: 'secret',
          refresh_token: null,
          permission: UserPermission.USER,
        };

        // Act
        (usersRepository.findByEmail as jest.Mock).mockReturnValue(userData);

        (usersRepository.create as jest.Mock).mockReturnValue(userData);

        await usersService.create(createUserData);
      } catch (error) {
        expect(error.getStatus()).toBe(409);
        expect(error.message).toBe('users.USER_ALREADY_EXISTS');
      }
    });
  });

  describe('getAllUsers', () => {
    it('Should get all users', async () => {
      // Arrange
      const firstUserData = {
        email: 'testemail@gmail.com',
        password: 'password',
        permission: UserPermission.TRIAL,
      };

      const secondUserData = {
        email: 'seconduser@gmail.com',
        password: 'secret',
        permission: UserPermission.MASTER,
      };

      usersService.create({
        email: firstUserData.email,
        password: firstUserData.password,
      });

      usersService.create({
        email: secondUserData.email,
        password: secondUserData.password,
      });

      // Act
      (usersRepository.getAll as jest.Mock).mockReturnValue([
        { id: '1', email: firstUserData.email },
        { id: '2', email: secondUserData.email },
      ]);

      const users = await usersService.getAllUsers();

      // Assert
      expect(users[0].id).toBe('1');
      expect(users[0].email).toBe(firstUserData.email);

      expect(users[1].id).toBe('2');
      expect(users[1].email).toBe(secondUserData.email);
    });
  });

  describe('findByEmail', () => {
    it('Should retrieve the correct user by email', async () => {
      // Arrange
      const userData: UserData = {
        id: '1',
        email: 'test@email.com',
        password: 'secret',
        refresh_token: 'token',
        permission: UserPermission.USER,
      };

      // Act
      (usersRepository.findByEmail as jest.Mock).mockReturnValue(userData);

      const user = await usersService.findByEmail(userData.email);

      // Assert
      expect(user).toEqual(userData);
      expect(user?.id).toBe(userData.id);
      expect(user?.email).toBe(userData.email);
      expect(user?.password).toBe(userData.password);
      expect(user?.permission).toBe(userData.permission);
    });

    it('Should throw a 404 error if user not found', async () => {
      try {
        await usersService.findByEmail('invalid-email');
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('users.USER_NOT_FOUND');
      }
    });
  });

  describe('findById', () => {
    it('Should retrieve the correct user by id', async () => {
      // Arrange
      const userData: UserData = {
        id: '1',
        email: 'test@email.com',
        password: 'secret',
        refresh_token: 'token',
        permission: UserPermission.USER,
      };

      // Act
      (usersRepository.findById as jest.Mock).mockReturnValue(userData);

      const user = await usersService.findById(userData.email);

      // Assert
      expect(user).toEqual(userData);
      expect(user?.id).toBe(userData.id);
      expect(user?.email).toBe(userData.email);
      expect(user?.password).toBe(userData.password);
      expect(user?.permission).toBe(userData.permission);
    });

    it('Should throw a 404 error if user not found', async () => {
      try {
        await usersService.findById('invalid-id');
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('users.USER_NOT_FOUND');
      }
    });
  });

  describe('findPublicByEmail', () => {
    it('Should retrieve the correct public user by email', async () => {
      // Arrange
      const publicUserData: PublicUserData = {
        id: '1',
        email: 'test@email.com',
        refresh_token: 'token',
      };

      // Act
      (usersRepository.findByEmail as jest.Mock).mockReturnValue(
        publicUserData,
      );

      const user = await usersService.findPublicByEmail(publicUserData.email);

      // Assert
      expect(user).toEqual(publicUserData);
      expect(user?.id).toBe(publicUserData.id);
      expect(user?.email).toBe(publicUserData.email);
    });

    it('Should throw a 404 error if user not found', async () => {
      try {
        await usersService.findPublicByEmail('invalid-email');
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('users.USER_NOT_FOUND');
      }
    });
  });

  describe('findPublicById', () => {
    it('Should retrieve the correct public user by id', async () => {
      // Arrange
      const publicUserData: PublicUserData = {
        id: '1',
        email: 'test@email.com',
        refresh_token: 'token',
      };

      // Act
      (usersRepository.findById as jest.Mock).mockReturnValue(publicUserData);

      const user = await usersService.findPublicById(publicUserData.email);

      // Assert
      expect(user).toEqual(publicUserData);
      expect(user?.id).toBe(publicUserData.id);
      expect(user?.email).toBe(publicUserData.email);
    });

    it('Should throw a 404 error if user not found', async () => {
      try {
        await usersService.findById('invalid-id');
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('users.USER_NOT_FOUND');
      }
    });
  });

  describe('updateRefreshToken', () => {
    it('Should update the refresh token', async () => {
      // Arrange
      const publicUserData: PublicUserData = {
        id: '1',
        email: 'test@email.com',
        refresh_token: 'token',
      };

      const userData: UserData = {
        id: '1',
        email: 'test@email.com',
        password: 'secret',
        refresh_token: 'new-token',
        permission: UserPermission.USER,
      };

      // Act
      (usersRepository.updateRefreshToken as jest.Mock).mockReturnValue(
        userData,
      );

      const updatedToken = await usersService.updateRefreshToken(
        publicUserData.id,
        'new-token',
      );

      // Assert
      expect(updatedToken).toBe('new-token');
    });
  });

  describe('revokeToken', () => {
    it('Should call revokeToken function of userRepository with the correct id', async () => {
      // Arrange
      const publicUserData: PublicUserData = {
        id: '1',
        email: 'test@email.com',
        refresh_token: 'token',
      };

      const userData: UserData = {
        id: '1',
        email: 'test@email.com',
        password: 'secret',
        refresh_token: 'new-token',
        permission: UserPermission.USER,
      };

      // Act
      (usersRepository.revokeToken as jest.Mock).mockReturnValue(userData);

      usersService.revokeToken(publicUserData.id);

      // Assert
      expect(usersRepository.revokeToken).toHaveBeenCalledWith(
        publicUserData.id,
      );
    });
  });
});
