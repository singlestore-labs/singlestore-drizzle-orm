import { bigint, datetime, int, mysqlTable, serial, text, varchar } from '@drodrigues4/drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  fullName: varchar('name', { length: 256 }),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

export const messages = mysqlTable('messages', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('user_id', { mode: 'number' }),
  message: varchar('message', { length: 256 }),
  createdAt: datetime('created_at'),
});

export type Message = typeof messages.$inferSelect; // return type when queried
export type NewMessage = typeof messages.$inferInsert; // insert type
