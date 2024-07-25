import {
  bigint,
  datetime,
  singlestoreTable,
  timestamp,
  varchar,
} from "@drodrigues4/drizzle-orm/singlestore-core";

export const user = singlestoreTable('user', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  name: varchar('name', { length: 256 }),
  email: varchar('email', { length: 256 }),
});

export type User = typeof user.$inferSelect; // return type when queried
export type NewUser = typeof user.$inferInsert; // insert type

export const post = singlestoreTable('post', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: datetime('created_on', { fsp: 6 }).notNull().defaultNow(6),
  content: varchar('content', { length: 256 }).notNull(),
  creatorId: bigint('creator_id', { mode: 'number' }).notNull(),
});

// export const postRelation = relations(post, ({ one }) => ({
//   creator: one(user, {
//     fields: [post.creatorId],
//     references: [user.id],
// })}));

export type Post = typeof post.$inferSelect; // return type when queried
export type NewPost = typeof post.$inferInsert; // insert type

export const comment = singlestoreTable('comment', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  createdOn: timestamp('created_on', { fsp: 6 }).notNull().defaultCurrentTimestamp(6),
  content: varchar('content', { length: 256 }).notNull(),
  userId: bigint('user_id', { mode: 'number' }).notNull(),
  postId: bigint('post_id', { mode: 'number' }).notNull(),
  repliesToComment: bigint('replies_to_comment', { mode: 'number' }),
});
