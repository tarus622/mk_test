import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private i18n: I18nContext;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.i18n = I18nContext.current(context) as I18nContext;
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException({
        message: this.i18n.t('auth.INVALID_OR_EXPIRED_TOKEN'),
      });
    }
    return user;
  }
}
