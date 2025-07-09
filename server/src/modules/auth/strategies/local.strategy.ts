import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { I18nService } from 'nestjs-i18n';
import { UserData } from 'src/modules/users/repositories/types/UserData';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private i18n: I18nService,) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<UserData> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({message: this.i18n.t('auth.INVALID_USER')});
    }
    return user;
  }
}
