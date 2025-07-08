import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './helpers/permission.decorator';
import { PermissionLevel } from 'src/enums/permission-level.enum';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get(Permission, context.getHandler());
    if (!permission || permission === 'public') {
      return true;
    }

    const i18n = I18nContext.current(context) as I18nContext;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const userPermissionLevel = user.permission;

    const hasPermission = this.matchPermission(permission, userPermissionLevel);

    if (!hasPermission)
      throw new ForbiddenException({
        message: i18n.t('auth.INSUFFICIENT_PERMISSION'),
      });

    return true;
  }

  private matchPermission(permission: string, userPermission: string) {
    return PermissionLevel[permission] <= PermissionLevel[userPermission];
  }
}
