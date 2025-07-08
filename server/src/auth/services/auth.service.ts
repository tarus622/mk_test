import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthService } from './interfaces/IAuthService';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.getPassword()))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

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

    this.usersService.updateRefreshToken(user.id, hashedToken);

    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
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

    const isMatch = await bcrypt.compare(refreshToken, user?.getRefreshToken());

    if (!isMatch)
      throw new UnauthorizedException({
        message: this.i18n.t('auth.INVALID_REFRESH_TOKEN'),
      });

    return this.login(user);
  }
}
