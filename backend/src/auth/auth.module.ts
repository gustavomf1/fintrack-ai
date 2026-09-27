import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleModule } from '../db/drizzle.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

const jwtModule = JwtModule.registerAsync({
  useFactory: () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não está definido no .env');
    }
    return { secret, signOptions: { expiresIn: '1d' } };
  },
});

@Module({
  imports: [DrizzleModule, jwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, jwtModule],
})
export class AuthModule {}
