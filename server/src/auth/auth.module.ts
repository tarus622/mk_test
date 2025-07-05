import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        privateKey: Buffer.from(
          config.get<string>('JWT_PRIVATE_KEY_BASE64') as string,
          'base64',
        ),
        publicKey: Buffer.from(
          config.get<string>('JWT_PUBLIC_KEY_BASE64') as string,
          'base64',
        ),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '1800s',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService],
})
export class AuthModule {}
