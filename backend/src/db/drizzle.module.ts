import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

export const DRIZZLE = 'DRIZZLE';

@Module({
    providers: [
        {
            provide: DRIZZLE,
            useFactory: () => {
                const connectionString = process.env.DATABASE_URL;
                if (!connectionString) {
                    throw new Error('DATABASE_URL nao esta definida');
                }

                const pool = new Pool({
                    connectionString,
                    max: process.env.NODE_ENV === 'production' ? 1 : 10,
                });
                return drizzle(pool);
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DrizzleModule {}
