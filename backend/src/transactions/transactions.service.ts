import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Transaction } from './entities/transaction.entity';
import { DRIZZLE } from '../db/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';
import { transactions } from '../db/schema';

type CreateTransactionDto = Omit<Transaction, 'id'>;

@Injectable()
export class TransactionsService {
    constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

    async findAll(){
        return this.db.select().from(transactions);
    }

    async create(data: CreateTransactionDto){
        const [newTransaction] = await this.db.insert(transactions).values(data).returning();
        return newTransaction;
    }
}