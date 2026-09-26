import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Transaction } from './entities/transaction.entity';
import { DRIZZLE } from '../db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { transactions } from '../db/schema';

type CreateTransactionDto = Omit<Transaction, 'id'>;

@Injectable()
export class TransactionsService {
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

    async findAll(userId: string){
        return this.db.select().from(transactions).where(eq(transactions.userId, userId));
    }

    async create(data: CreateTransactionDto){
        const [newTransaction] = await this.db.insert(transactions).values(data).returning();
        return newTransaction;
    }
}
