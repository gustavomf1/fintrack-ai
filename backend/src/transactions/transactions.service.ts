import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { Transaction } from './entities/transaction.entity';
import { DRIZZLE } from '../db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { transactions } from '../db/schema';

type CreateTransactionDto = Omit<Transaction, 'id'>;
type UpdateTransactionDto = Omit<Transaction, 'id' | 'userId'>;

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

    async update(id: string, userId: string, data: UpdateTransactionDto){
        const [updated] = await this.db
            .update(transactions)
            .set(data)
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning();

        if (!updated) throw new NotFoundException('Transaction not found');
        return updated;
    }

    async remove(id: string, userId: string){
        const [deleted] = await this.db
            .delete(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning();

        if (!deleted) throw new NotFoundException('Transaction not found');
        return deleted;
    }
}
