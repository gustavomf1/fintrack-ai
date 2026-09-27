import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/express';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let mockService: any;

  const mockUser: AuthenticatedUser = { sub: 'user-1', email: 'gustavo@example.com' };

  beforeEach(async () => {
    mockService = {
      findAll: jest.fn().mockResolvedValue([
        { id: '1', userId: 'user-1', amount: 50, category: 'food', description: 'Lunch', createdAt: new Date() },
      ]),
      create: jest.fn().mockResolvedValue({
        id: '2',
        userId: 'user-1',
        amount: 30,
        category: 'transport',
        description: 'Uber',
        createdAt: new Date(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: TransactionsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll delega pro service com o id do usuário logado', async () => {
    const result = await controller.findAll(mockUser);

    expect(mockService.findAll).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([
      { id: '1', userId: 'user-1', amount: 50, category: 'food', description: 'Lunch', createdAt: expect.any(Date) },
    ]);
  });

  it('create delega os dados e o id do usuário logado pro service', async () => {
    const data = { amount: 30, category: 'transport' as const, description: 'Uber', date: new Date() };

    const result = await controller.create(data, mockUser);

    expect(mockService.create).toHaveBeenCalledWith({ ...data, userId: 'user-1' });
    expect(result).toEqual({
      id: '2',
      userId: 'user-1',
      amount: 30,
      category: 'transport',
      description: 'Uber',
      createdAt: expect.any(Date),
    });
  });
});
