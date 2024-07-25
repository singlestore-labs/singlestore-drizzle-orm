import {
  bigint,
  datetime,
  singlestoreTable,
  timestamp,
  varchar,
} from "drizzle-orm/singlestore-core";

export const post = singlestoreTable('post', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: timestamp('created_on', { fsp: 6 }).defaultNow(6),
  content: varchar('content', { length: 256 }).notNull(),
});

export type Post = typeof post.$inferSelect; // return type when queried
export type NewPost = typeof post.$inferInsert; // insert type

export const comment = singlestoreTable('comment', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: timestamp('created_on', { fsp: 6 }).notNull().defaultCurrentTimestamp(6),
  content: varchar('content', { length: 256 }).notNull(),
  postId: bigint('post_id', { mode: 'number' }).notNull(),
  repliesToComment: bigint('replies_to_comment', { mode: 'number' }),
});

export type Comment = typeof comment.$inferSelect; // return type when queried
export type NewComment = typeof comment.$inferInsert; // insert type
