import { index, int, singlestoreTable, bigint, varchar } from '../../src/singlestore-core';

export const users = singlestoreTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  fullName: varchar('full_name', { length: 256 }),
}, (users: User[]) => ({
  nameIdx: index('name_idx').on(users.fullName),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
