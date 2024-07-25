import { mysqlTable, bigint, varchar, timestamp } from "drizzle-orm/mysql-core";

export const user = mysqlTable('user', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }),
});

export const post = mysqlTable('post', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: timestamp('created_on', { fsp: 6 }).notNull().defaultNow(),
  content: varchar('content', { length: 256 }).notNull(),
  creatorId: bigint('creator_id', { mode: 'number' }).notNull(),
});

export const comment = mysqlTable('comment', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: timestamp('created_on', { fsp: 6 }).notNull().defaultNow(),
  content: varchar('content', { length: 256 }).notNull(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  postId: bigint('post_id', { mode: 'number' }).notNull(),
  repliesToComment: bigint('replies_to_comment', { mode: 'number' }),
});
