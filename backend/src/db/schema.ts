import { pgTable, uuid, text, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";

export const categoryEnuym = pgEnum('category', ['food', 'transport', 'subscription', 'other']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id),
    amount: numeric('amount', { precision: 10, scale: 2, mode: 'number' }).notNull(),
    category: categoryEnuym('category').notNull(),
    description: text('description').notNull(),
    date: timestamp('date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
