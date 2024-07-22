import { expect, test, describe } from 'vitest'

import { connection, db } from '../db';
import { users, messages } from './schema';
import { migrate } from 'drizzle-orm/mysql2/migrator';

import { eq } from 'drizzle-orm';

await connection.query('DROP TABLE IF EXISTS users');
await connection.query('DROP TABLE IF EXISTS messages');
await connection.query('DROP TABLE IF EXISTS __drizzle_migrations');

await migrate(db, { migrationsFolder: 'test/test1/migrations' });

describe('users', () => {
	test('should insert a user', async () => {
		const result = await db.insert(users).values({ fullName: 'Morty' });
		expect(result).toEqual([
			{
				fieldCount: 0,
				affectedRows: 1,
				serverStatus: 2,
				warningStatus: 0,
				changedRows: 0,
				info: '',
				insertId: result[0].insertId
			},
			undefined
		]);
	});

	test('should get users', async () => {
		const result = await db.select().from(users);
		expect(result).toEqual([
			{
				id: result[0].id,
				fullName: 'Morty'
			}
		]);
	});
});

describe('messages', async () => {
	test('should insert a message', async () => {
		var result = await db.select().from(users);
		const user = result[0];

		result = await db.insert(messages).values({
			userId: user.id,
			message: 'Hello',
			createdAt: new Date()
		});
		expect(result).toEqual([
			{
				fieldCount: 0,
				affectedRows: 1,
				serverStatus: 2,
				warningStatus: 0,
				changedRows: 0,
				info: '',
				insertId: result[0].insertId
			},
			undefined
		]);
	});

	test('should join with users', async () => {
		var result
		
		result = await db.select().from(users);
		const user = result[0];

		result = await db.select().from(messages);
		const message = result[0];

		result = await db.select().from(messages).innerJoin(users, eq(messages.userId, users.id));
		expect(result).toEqual([
			{
				messages: {
					id: message.id,
					userId: message.userId,
					message: 'Hello',
					createdAt: message.createdAt,
				},
				users: {
					id: user.id,
					fullName: 'Morty',
				},
			}
		]);

		result = await db.select().from(messages).fullJoin(users, eq(messages.userId, users.id));
		expect(result).toEqual([
			{
				messages: {
					id: message.id,
					userId: message.userId,
					message: 'Hello',
					createdAt: message.createdAt,
				},
				users: {
					id: user.id,
					fullName: 'Morty',
				},
			}
		]);
	});

	// test.skip('should not allow lateral joins', async () => {
	// 	expect(() => {
	// 		db.select().from(users).leftJoin(messages, eq(messages.userId, users.id));
	// 	}).toThrowError('__vite_ssr_import_1__.db.select(...).from(...).leftJoin is not a function');

	// 	expect(() => {
	// 		db.select().from(users).rightJoin(messages, eq(messages.userId, users.id));
	// 	}).toThrowError('__vite_ssr_import_1__.db.select(...).from(...).leftJoin is not a function');
	// });
});
