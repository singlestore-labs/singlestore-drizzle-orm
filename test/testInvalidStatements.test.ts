import { expect, test, describe } from 'vitest'

import { index, int, singlestoreTable, bigint, varchar } from 'drizzle-orm/singlestore-core';

test('should not be able to add references', async () => {
	const users = singlestoreTable('users', 
		{
			id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
			fullName: varchar('full_name', { length: 256 }),
		}, (table) => ({
			nameIdx: index('name_idx').on(table.fullName),
		})
	)

	expect(() => {
		const messages = singlestoreTable('messages', {
			id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
			userId: bigint('user_id', { mode: 'number' }).references(() => users.id),
			message: varchar('message', { length: 256 }),
			createdAt: int('created_at'),
		});
	}).toThrowError('references is not a function');
});
