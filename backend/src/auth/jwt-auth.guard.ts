import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { AuthenticatedUser } from './types/express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.jwtService.verifyAsync<AuthenticatedUser>(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
