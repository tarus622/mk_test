import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Req() req: Request): Promise<any> {
    const users = this.usersService.getAll();
    return users;
  }
}
