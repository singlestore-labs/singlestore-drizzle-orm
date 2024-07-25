import { expect, test, describe } from 'vitest'

import { connect } from '../db';
import { users } from './schema';
import { migrate } from '@drodrigues4/drizzle-orm/singlestore/migrator';

import { eq } from '@drodrigues4/drizzle-orm';

const [connectionNoDatabase, dbNoDatabase] = await connect();

await connectionNoDatabase.query('DROP DATABASE IF EXISTS test2');
await connectionNoDatabase.query('CREATE DATABASE test2');

const [connection, db] = await connect("test2");

await migrate(db, { migrationsFolder: 'test/test2/migrations' });

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
		const [result] = await db.select().from(users);
		expect(result.extID).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/)
		expect(result.fullName).toEqual("Morty")
	});
});
