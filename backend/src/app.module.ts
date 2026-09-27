import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
