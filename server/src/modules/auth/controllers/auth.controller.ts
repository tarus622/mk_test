import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const tokens = await this.authService.login(req.user);
    return tokens;
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await this.authService.refreshToken(token as string);

    return result;
  }
}
