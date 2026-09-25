import { pgTable, uuid, text, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";

export const categoryEnuym = pgEnum('category', ['food', 'transport', 'subscription', 'other']);

export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    amount: numeric('amount', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    category: categoryEnuym('category').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
