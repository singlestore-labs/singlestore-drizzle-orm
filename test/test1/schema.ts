import { sql } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/singlestore-core/columns/uuid';
import { index, singlestoreTable, bigint, varchar, datetime } from 'drizzle-orm/singlestore-core';

export const users = singlestoreTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  fullName: varchar('full_name', { length: 256 }),
  extID: uuid("external_id").$default(() => sql`UUID()`)
}, (table) => ({
  nameIdx: index('name_idx').on(table.fullName),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

export const messages = singlestoreTable('messages', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  userId: bigint('user_id', { mode: 'number' }),
  message: varchar('message', { length: 256 }),
  createdAt: datetime('created_at'),
});

export type Message = typeof messages.$inferSelect; // return type when queried
export type NewMessage = typeof messages.$inferInsert; // insert type
