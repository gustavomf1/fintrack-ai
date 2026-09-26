import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import * as bcrypt from 'bcryptjs';
import { DRIZZLE } from '../db/drizzle.module';
import { users } from '../db/schema';
import type { AuthCredentialsDto } from './dto/auth-credentials.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthCredentialsDto) {
    const [existing] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, dto.email));

    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const [created] = await this.db
      .insert(users)
      .values({ email: dto.email, passwordHash })
      .returning({ id: users.id, email: users.email });

    return this.issueToken(created);
  }

  async login(dto: AuthCredentialsDto) {
    const [found] = await this.db.select().from(users).where(eq(users.email, dto.email));

    if (!found || !(await bcrypt.compare(dto.password, found.passwordHash))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.issueToken({ id: found.id, email: found.email });
  }

  private async issueToken(user: { id: string; email: string }) {
    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { accessToken, user };
  }
}
