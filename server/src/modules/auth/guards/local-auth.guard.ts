import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any, context: any) {
    const i18n = I18nContext.current(context) as I18nContext;

    if (err || !user) {
      throw new UnauthorizedException({
        message: i18n.t('auth.INVALID_CREDENTIALS'),
      });
    }

    return user;
  }
}
