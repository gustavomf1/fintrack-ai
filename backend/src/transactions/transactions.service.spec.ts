import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { DRIZZLE } from '../db/drizzle.module';
import { transactions } from '../db/schema';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockDb: any;

  beforeEach(async () => {
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([
        { id: '1', userId: 'user-1', amount: 50, category: 'food', description: 'Lunch', createdAt: new Date() },
      ]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        { id: '2', userId: 'user-1', amount: 30, category: 'transport', description: 'Uber', createdAt: new Date() },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: DRIZZLE, useValue: mockDb },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll retorna só as linhas do usuário logado', async () => {
    const result = await service.findAll('user-1');

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(transactions);
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual([
      { id: '1', userId: 'user-1', amount: 50, category: 'food', description: 'Lunch', createdAt: expect.any(Date) },
    ]);
  });

  it('create insere e retorna a transação criada', async () => {
    const data = {
      userId: 'user-1',
      amount: 30,
      category: 'transport' as const,
      description: 'Uber',
      date: new Date(),
    };

    const result = await service.create(data);

    expect(mockDb.insert).toHaveBeenCalledWith(transactions);
    expect(mockDb.values).toHaveBeenCalledWith(data);
    expect(mockDb.returning).toHaveBeenCalled();
    expect(result).toEqual(
      { id: '2', userId: 'user-1', amount: 30, category: 'transport', description: 'Uber', createdAt: expect.any(Date) },
    );
  });
});
