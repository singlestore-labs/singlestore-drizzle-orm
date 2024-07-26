import {
  bigint,
  datetime,
  singlestoreTable,
  timestamp,
  text,
} from "drizzle-orm/singlestore-core";

import { relations } from 'drizzle-orm';

export const post = singlestoreTable('post', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().defaultNow(6),
  content: text('content').notNull(),
});

export type Post = typeof post.$inferSelect; // return type when queried
export type NewPost = typeof post.$inferInsert; // insert type

export const comment = singlestoreTable('comment', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().defaultCurrentTimestamp(6),
  content: text('content').notNull(),
  postId: bigint('post_id', { mode: 'number' }).notNull(),
  repliesToComment: bigint('replies_to_comment', { mode: 'number' }),
});

export type Comment = typeof comment.$inferSelect; // return type when queried
export type NewComment = typeof comment.$inferInsert; // insert type

export const postsRelations = relations(post, ({ many }) => ({
  comments: many(comment),
}));

export const commentsRelations = relations(comment, ({ one }) => ({
  post: one(post, {
    fields: [comment.postId],
    references: [post.id],
  }),
}));
