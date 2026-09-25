import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Transaction } from './entities/transaction.entity';

type CreateTransactionDto = Omit<Transaction, 'id'>;

@Injectable()
export class TransactionsService {
    private transactions: Transaction[] = [];

    findAll(): Transaction[] {
        return this.transactions;
    }

    create(data: CreateTransactionDto): Transaction {
        const newTransaction: Transaction = { id: randomUUID(), ...data };
        this.transactions.push(newTransaction);
        return newTransaction;
    }
}