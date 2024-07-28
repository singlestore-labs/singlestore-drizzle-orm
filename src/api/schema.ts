import {
  singlestoreTable,
  datetime,
  text,
  fulltext,
  varchar,
  index,
  sortKey,
} from "drizzle-orm/singlestore-core";
import {
  desc,
} from "drizzle-orm";


import { relations } from 'drizzle-orm';

import { newID } from './common';

export const post = singlestoreTable('post', {
  id: varchar('id', { length: 16 }).primaryKey().$default(() => newID()),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().defaultNow(6),
  content: text('content').notNull(),
}, (table) => {
  return {
    postFullTextIdx: fulltext('postFullTextIdx', { version: 2 }).on(table.content),
    sortedKey: sortKey(
      desc(table.createdOn),
    ),
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
    commentFullTextIdx: fulltext('commentFullTextIdx', { version: 2 }).on(table.content),
    postIdIdx: index('post_id_idx').on(table.postId).using('hash'),
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
