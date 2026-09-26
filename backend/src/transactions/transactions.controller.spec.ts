import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';



describe('TransactionsController', () => {
  let controller: TransactionsController;
  let mockService: any;

  beforeEach(async () => {
      mockService = {
        findAll: jest.fn().mockResolvedValue([
          { id: '1', amount: 50, category: 'food', description: 'Lunch', createdAt: new Date() },
        ]),
        create: jest.fn().mockResolvedValue({
          id: '2',
          amount: 30,
          category: 'transport',
          description: 'Uber',
          createdAt: new Date(),
        }),
      };
  
      const module: TestingModule = await Test.createTestingModule({
        controllers: [TransactionsController],
        providers: [
          { provide: TransactionsService, useValue: mockService },
        ],
      }).compile();
  
      controller = module.get<TransactionsController>(TransactionsController);
    });

  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll delega pro service e retorna o resultado', async () => {
      const result = await controller.findAll();
  
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: '1', amount: 50, category: 'food', description: 'Lunch', createdAt: expect.any(Date) },
      ]);
    });
  
    it('create delega os dados pro service', async () => {
      const data = { amount: 30, category: 'transport' as const, description: 'Uber', date: new Date() };
  
      const result = await controller.create(data);
  
      expect(mockService.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(
        { id: '2', amount: 30, category: 'transport', description: 'Uber', createdAt: expect.any(Date) },
      );
    });
});
