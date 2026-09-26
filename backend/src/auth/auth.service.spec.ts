import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { DRIZZLE } from '../db/drizzle.module';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let mockDb: any;
  let mockJwt: { signAsync: jest.Mock };

  beforeEach(async () => {
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    };
    mockJwt = { signAsync: jest.fn().mockResolvedValue('signed-jwt') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: DRIZZLE, useValue: mockDb },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register cria um usuário novo e devolve um token', async () => {
    mockDb.where.mockResolvedValueOnce([]);
    mockDb.returning.mockResolvedValueOnce([{ id: 'user-1', email: 'a@a.com' }]);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    const result = await service.register({ email: 'a@a.com', password: '12345678' });

    expect(bcrypt.hash).toHaveBeenCalledWith('12345678', 10);
    expect(mockDb.values).toHaveBeenCalledWith({ email: 'a@a.com', passwordHash: 'hashed' });
    expect(mockJwt.signAsync).toHaveBeenCalledWith({ sub: 'user-1', email: 'a@a.com' });
    expect(result).toEqual({ accessToken: 'signed-jwt', user: { id: 'user-1', email: 'a@a.com' } });
  });

  it('register rejeita e-mail já cadastrado', async () => {
    mockDb.where.mockResolvedValueOnce([{ id: 'existing' }]);

    await expect(service.register({ email: 'a@a.com', password: '12345678' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('login autentica com senha correta', async () => {
    mockDb.where.mockResolvedValueOnce([{ id: 'user-1', email: 'a@a.com', passwordHash: 'hashed' }]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login({ email: 'a@a.com', password: '12345678' });

    expect(bcrypt.compare).toHaveBeenCalledWith('12345678', 'hashed');
    expect(result).toEqual({ accessToken: 'signed-jwt', user: { id: 'user-1', email: 'a@a.com' } });
  });

  it('login rejeita senha errada', async () => {
    mockDb.where.mockResolvedValueOnce([{ id: 'user-1', email: 'a@a.com', passwordHash: 'hashed' }]);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login({ email: 'a@a.com', password: 'wrong' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('login rejeita e-mail inexistente', async () => {
    mockDb.where.mockResolvedValueOnce([]);

    await expect(
      service.login({ email: 'nope@a.com', password: '12345678' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
