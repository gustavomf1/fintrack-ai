import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { DrizzleModule } from '../db/drizzle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DrizzleModule, AuthModule],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
