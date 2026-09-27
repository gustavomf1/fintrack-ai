import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { DrizzleModule } from '../db/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { InsightsService } from './insights.service';

@Module({
  imports: [DrizzleModule, AuthModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, InsightsService],
})
export class TransactionsModule {}
