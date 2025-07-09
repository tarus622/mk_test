import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { I18nService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../modules/users/services/users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UsersRepository } from '../../../modules/users/repositories/users.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersRepository,
        UsersService,
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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
