import { bigint, bson, singlestoreTable, varchar } from 'drizzle-orm/singlestore-core';
import { blob } from 'drizzle-orm/singlestore-core/columns/blob';

export const users = singlestoreTable('users', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  fullName: varchar('full_name', { length: 256 }),
  bsonCol: bson('bson_column'),
  blobCol: blob('blob_column'),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
