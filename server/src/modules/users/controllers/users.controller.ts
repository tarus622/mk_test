import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { PublicUserData } from './types/public-user-data';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() data: CreateUserDto,
  ): Promise<PublicUserData> {
    const user = await this.usersService.create(data);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Req() req: Request): Promise<Partial<PublicUserData>[]> {
    const users = await this.usersService.getAllUsers();

    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUserById(@Req() req: Request): Promise<PublicUserData> {
    const { id } = req.params;
    const user = await this.usersService.findPublicById(id);

    return user;
  }
}
