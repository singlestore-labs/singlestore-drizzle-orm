// src/index.ts
import { connection, db } from '../db';
import { NewUser, users } from '../schema';
import { SinglestoreRawQueryResult } from '../../src/singlestore-core';

describe('test2', () => {
	it('should insert a user', async () => {
		const result = await db.insert(users).values({ fullName: 'Morty' });
	// 	expect(result).toEqual({ affectedRows: 1, insertId: 1 });
	});
});

// await db.insert(users).values({ fullName: 'Morty' });

// const result = await db.select().from(users)

// console.log(result);

// connection.end();
