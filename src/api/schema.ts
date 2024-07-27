import {
  singlestoreTable,
  datetime,
  text,
  fulltext,
  varchar,
} from "drizzle-orm/singlestore-core";
import { getRandomValues } from "node:crypto";

import { relations } from 'drizzle-orm';

function newID() {
  return Buffer.from(getRandomValues(new Uint8Array(16))).toString("hex").slice(0, 16);
}

export const post = singlestoreTable('post', {
  id: varchar('id', { length: 16 }).primaryKey().$default(() => newID()),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().defaultNow(6),
  content: text('content').notNull(),
}, (table) => {
  return {
    postFullTextIdx: fulltext('postFullTextIdx', { version: 2 }).on(table.content)
  } 
});

export type Post = typeof post.$inferSelect; // return type when queried
export type NewPost = typeof post.$inferInsert; // insert type

export const comment = singlestoreTable('comment', {
  id: varchar('id', { length: 16 }).primaryKey().$default(() => newID()),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().defaultNow(6),
  content: text('content').notNull(),
  postId: varchar('post_id', { length: 16 }).notNull(),
  repliesToComment: varchar('replies_to_comment', { length: 16 }),
}, (table) => {
  return {
    commentFullTextIdx: fulltext('commentFullTextIdx', { version: 2 }).on(table.content)
  }
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
