import { expect, test, describe } from 'vitest'

import { BSON } from 'bson';

import { connect } from '../db';
import { users } from './schema';
import { migrate } from 'drizzle-orm/singlestore/migrator';

const [connectionNoDatabase] = await connect();

await connectionNoDatabase.query('DROP DATABASE IF EXISTS test2');
await connectionNoDatabase.query('CREATE DATABASE test2');

const [, db] = await connect("test2");

await migrate(db, { migrationsFolder: 'test/test2/migrations' });

describe('users', () => {
	test('should insert a user with a bson', async () => {
		const bsonTest = { a: 1, b: 2, c: 3 };
		const newUser = { name: 'Rick', age: 14, bsonCol: bsonTest };

		const result = await db.insert(users).values(newUser);
		
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
		expect(result.name).toEqual("Rick");
		expect(result.age).toEqual(14);
		const bsonResult = result.bsonCol;
		expect(bsonResult).toEqual({ a: 1, b: 2, c: 3 });
	});
});
