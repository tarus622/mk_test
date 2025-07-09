import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../repositories/users.repository';
import { UserPermission } from '../../../enums/user-permission.enum';
import { I18nService } from 'nestjs-i18n';

describe('UsersRepository', () => {
  let userRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: I18nService,
          useValue: {
            t: jest.fn((key: string) => key),
          },
        },
      ],
    }).compile();

    userRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('Should create a user with correct email, password and permission', () => {
      // Arrange
      const email = 'testemail@gmail.com';
      const password = 'secret';
      const permission = UserPermission.TRIAL;

      // Act
      const user = userRepository.create(email, password, permission);

      // Assert
      expect(typeof user.id).toBe('string');
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
      expect(user.permission).toBe(permission);
    });
  });

  describe('getAll', () => {
    it('Should get all users', () => {
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

      userRepository.create(
        firstUserData.email,
        firstUserData.password,
        firstUserData.permission,
      );

      userRepository.create(
        secondUserData.email,
        secondUserData.password,
        secondUserData.permission,
      );

      // Act
      const users = userRepository.getAll();

      // Assert
      expect(typeof users[0].id).toBe('string');
      expect(users[0].email).toBe(firstUserData.email);
      expect(users[0].permission).toBe(firstUserData.permission);

      expect(typeof users[1].id).toBe('string');
      expect(users[1].email).toBe(secondUserData.email);
      expect(users[1].permission).toBe(secondUserData.permission);
    });
  });

  describe('findByEmail', () => {
    it('Should retrieve the correct user by email', () => {
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

      const firstUser = userRepository.create(
        firstUserData.email,
        firstUserData.password,
        firstUserData.permission,
      );

      userRepository.create(
        secondUserData.email,
        secondUserData.password,
        secondUserData.permission,
      );

      // Act
      const user = userRepository.findByEmail(firstUserData.email);

      // Assert
      expect(user?.id).toBe(firstUser.id);
      expect(user?.email).toBe(firstUser.email);
      expect(user?.password).toBe(firstUser.password);
      expect(user?.permission).toBe(firstUser.permission);
    });

    it('Should return null if user not found', () => {
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

      userRepository.create(
        firstUserData.email,
        firstUserData.password,
        firstUserData.permission,
      );

      userRepository.create(
        secondUserData.email,
        secondUserData.password,
        secondUserData.permission,
      );

      // Act
      const user = userRepository.findByEmail('invalid-email');

      // Assert
      expect(user).toBe(null);
    });
  });

  describe('findById', () => {
    it('Should retrieve the correct user by id', () => {
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

      const firstUser = userRepository.create(
        firstUserData.email,
        firstUserData.password,
        firstUserData.permission,
      );

      userRepository.create(
        secondUserData.email,
        secondUserData.password,
        secondUserData.permission,
      );

      // Act
      const user = userRepository.findById(firstUser.id);

      // Assert
      expect(user?.id).toBe(firstUser.id);
      expect(user?.email).toBe(firstUser.email);
      expect(user?.password).toBe(firstUser.password);
      expect(user?.permission).toBe(firstUser.permission);
    });

    it('Should return null if no user is found', () => {
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

      const firstUser = userRepository.create(
        firstUserData.email,
        firstUserData.password,
        firstUserData.permission,
      );

      userRepository.create(
        secondUserData.email,
        secondUserData.password,
        secondUserData.permission,
      );

      // Act
      const user = userRepository.findById('invalid-id');

      // Assert
      expect(user).toBe(null);
    });
  });

  describe('updatePermission', () => {
    it('Should update user permission', () => {
      // Arrange
      const userData = {
        email: 'testemail@gmail.com',
        password: 'password',
        permission: UserPermission.TRIAL,
      };

      const userCreated = userRepository.create(
        userData.email,
        userData.password,
        userData.permission,
      );

      // Act
      const userUpdated = userRepository.updatePermission(
        userCreated.id,
        UserPermission.ADMIN,
      );

      // Assert
      expect(userUpdated?.id).toBe(userCreated.id);
      expect(userUpdated?.permission).toBe(UserPermission.ADMIN);
    });

    it('Should throw a 404 error if user not found', () => {
      try {
        userRepository.updatePermission('invalid-id', UserPermission.ADMIN);
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('users.USER_NOT_FOUND');
      }
    });
  });

  describe('updateRefreshToken', () => {
    it('Should update the refresh token', () => {
      // Arrange
      const userData = {
        email: 'testemail@gmail.com',
        password: 'password',
        permission: UserPermission.TRIAL,
      };

      const userCreated = userRepository.create(
        userData.email,
        userData.password,
        userData.permission,
      );

      // Act
      const userUpdated = userRepository.updateRefreshToken(
        userCreated.id,
        'new-token',
      );

      // Assert
      expect(userUpdated?.id).toBe(userCreated.id);
      expect(userUpdated?.refresh_token).toBe('new-token');
    });

    it('Should throw a 404 error if user not found', () => {
      try {
        userRepository.updateRefreshToken('invalid-id', 'token');
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('users.USER_NOT_FOUND');
      }
    });
  });

  describe('revokeToken', () => {
    it('Should update the refresh token to null', () => {
      // Arrange
      const userData = {
        email: 'testemail@gmail.com',
        password: 'password',
        permission: UserPermission.TRIAL,
      };

      const userCreated = userRepository.create(
        userData.email,
        userData.password,
        userData.permission,
      );

      // Act
      userRepository.updateRefreshToken(userCreated.id, 'new-token');

      const userUpdated = userRepository.revokeToken(userCreated.id);

      // Assert
      expect(userUpdated?.id).toBe(userCreated.id);
      expect(userUpdated?.refresh_token).toBe(null);
    });

    it('Should throw a 404 error if user not found', () => {
      try {
        userRepository.revokeToken('invalid-id');
      } catch (error) {
        expect(error.getStatus()).toBe(404);
        expect(error.message).toBe('users.USER_NOT_FOUND');
      }
    });
  });
});
