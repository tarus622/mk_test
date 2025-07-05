import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
