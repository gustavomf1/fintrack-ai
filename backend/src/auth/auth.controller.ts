import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { authCredentialsSchema, type AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ZodValidationPipe } from '../transactions/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { AuthenticatedUser } from './types/express';

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(authCredentialsSchema)) dto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.register(dto);
    res.cookie(COOKIE_NAME, accessToken, { ...cookieOptions, maxAge: COOKIE_MAX_AGE_MS });
    return user;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body(new ZodValidationPipe(authCredentialsSchema)) dto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(dto);
    res.cookie(COOKIE_NAME, accessToken, { ...cookieOptions, maxAge: COOKIE_MAX_AGE_MS });
    return user;
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return { message: 'Sessão encerrada' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return { id: user.sub, email: user.email };
  }
}
