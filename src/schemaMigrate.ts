import { mysqlTable, bigint, text, datetime } from "drizzle-orm/mysql-core";
import { sql } from 'drizzle-orm/sql/sql';

export const post = mysqlTable('post', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().default(sql`now(6)`),
  content: text('content').notNull(),
});

export const comment = mysqlTable('comment', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().default(sql`now(6)`),
  content: text('content').notNull(),
  postId: bigint('post_id', { mode: 'number' }).notNull(),
  repliesToComment: bigint('replies_to_comment', { mode: 'number' }),
});
