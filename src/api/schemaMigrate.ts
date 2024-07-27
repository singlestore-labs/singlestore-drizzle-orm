import { mysqlTable,  text, datetime, varchar } from "drizzle-orm/mysql-core";
import { sql } from 'drizzle-orm/sql/sql';

export const post = mysqlTable('post', {
  id: varchar('id', { length: 16 }).primaryKey(),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().default(sql`now(6)`),
  content: text('content').notNull(),
});

export const comment = mysqlTable('comment', {
  id: varchar('id', { length: 16 }).primaryKey(),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().default(sql`now(6)`),
  content: text('content').notNull(),
  postId: varchar('post_id', { length: 16 }).notNull(),
  repliesToComment: varchar('replies_to_comment', { length: 16 }),
});
