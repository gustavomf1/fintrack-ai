import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { createTransactionSchema, type CreateTransactionDto } from './dto/create-transaction.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get()
    findAll() {
        return this.transactionsService.findAll();
    }

    @Post()
    create(@Body(new ZodValidationPipe(createTransactionSchema)) data: CreateTransactionDto) {
        return this.transactionsService.create(data);
    }
}

