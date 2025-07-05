import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: Buffer.from(
        config.get<string>('JWT_PUBLIC_KEY_BASE64') as string,
        'base64',
      ),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
