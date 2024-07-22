import { sql } from 'drizzle-orm';
import { uuid } from '../../src/columns/uuid';
import { index, singlestoreTable, bigint, varchar } from '../../src/singlestore-core';

export const users = singlestoreTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  fullName: varchar('full_name', { length: 256 }),
  extID: uuid("external_id").$default(() => sql`UUID()`)
}, (table) => ({
  nameIdx: index('name_idx').on(table.fullName),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
