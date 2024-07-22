import { expect, test } from 'vitest'

import { connection, db } from './db';
import { users } from './schema';
import { migrate } from 'drizzle-orm/mysql2/migrator';


await connection.query('DROP TABLE IF EXISTS users');
await connection.query('DROP TABLE IF EXISTS __drizzle_migrations');

await migrate(db, { migrationsFolder: 'test/test1/migrations' });

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
