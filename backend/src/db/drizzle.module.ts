import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { transactions } from './schema';

export const DRIZZLE = 'DRIZZLE';

@Module({
    providers: [
        {
            provide: DRIZZLE,
            useFactory: () => {
                const pool = new Pool({
                    connectionString: process.env.DATABASE_URL,
                });
                return drizzle(pool);
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DrizzleModule {}
