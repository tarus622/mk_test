import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../../modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthService } from './interfaces/IAuthService';
import { I18nService } from 'nestjs-i18n';
import { UserData } from './types/UserData';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserData | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: UserData): Promise<{ access_token: string; refresh_token: string }> {
    const userFound = await this.usersService.findById(user.id);

    const payload = {
      username: userFound.email,
      sub: userFound.id,
      permission: userFound.permission,
    };

    const access_token = await this.jwtService.signAsync(
      { ...payload, type: 'access' },
      {
        expiresIn: '15m',
      },
    );
    const refresh_token = await this.jwtService.signAsync(
      { ...payload, type: 'refresh' },
      {
        expiresIn: '7d',
      },
    );

    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(refresh_token, salt);

    await this.usersService.updateRefreshToken(user.id, hashedToken);

    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (err) {
      throw new UnauthorizedException({
        message: this.i18n.t('auth.INVALID_REFRESH_TOKEN'),
      });
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException({
        message: this.i18n.t('auth.INVALID_REFRESH_TOKEN'),
      });
    }

    const user = await this.usersService.findById(payload.sub);

    const isMatch = await bcrypt.compare(refreshToken, user?.refresh_token);

    if (!isMatch) {
      this.usersService.revokeToken(user.id);

      throw new UnauthorizedException({
        message: this.i18n.t('auth.INVALID_REFRESH_TOKEN'),
      });
    }

    return this.login(user);
  }
}
