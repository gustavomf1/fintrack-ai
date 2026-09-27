import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { createTransactionSchema, type CreateTransactionDto } from './dto/create-transaction.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/express';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @Get()
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.transactionsService.findAll(user.sub);
    }

    @Post()
    create(
        @Body(new ZodValidationPipe(createTransactionSchema)) data: CreateTransactionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.transactionsService.create({ ...data, userId: user.sub });
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(new ZodValidationPipe(createTransactionSchema)) data: CreateTransactionDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.transactionsService.update(id, user.sub, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser) {
        return this.transactionsService.remove(id, user.sub);
    }
}
