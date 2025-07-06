import { Controller, Get, Post, UseGuards, Req, Body, UseFilters } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '../entities/User';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() data: CreateUserDto): Promise<User> {
    const user = this.usersService.create(data);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUserById(@Req() req: Request): User {
    const { id } = req.params;
    const user = this.usersService.findById(id);

    return user;
  }
}
