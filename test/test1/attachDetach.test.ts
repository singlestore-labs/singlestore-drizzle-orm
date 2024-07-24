import { expect, test, describe } from 'vitest'

import { connection, db } from '../db';
import { dbNoDatabase } from '../dbNoDatabase';
import { migrate } from '@drodrigues4/drizzle-orm/singlestore/migrator';
import { users } from './schema';
import { drizzle } from '@drodrigues4/drizzle-orm/singlestore';
import * as schema from './schema';
import mysql from 'mysql2/promise';

if (!process.env.UNITTEST_DATABASE) {
	throw new Error('UNITTEST_DATABASE is not defined');
}
const dbName = process.env.UNITTEST_DATABASE

await connection.query(`DROP TABLE IF EXISTS users`);
await connection.query(`DROP TABLE IF EXISTS messages`);
await connection.query(`DROP TABLE IF EXISTS __drizzle_migrations`);

await migrate(db, { migrationsFolder: 'test/test1/migrations' });

describe('attach and detach', async () => {
	test('should detach and attach database', async () => {
		var result

		result = await dbNoDatabase.detach(dbName);

		console.log(result); // TODO(singlestore): format this response in a pretty way, so we can get `result.milestone_name`

		result = await dbNoDatabase.attach(dbName);

		console.log(result);
	}, 30 * 1000);

	test('should detach and attach database with milestones', async () => {
		if (!process.env.UNITTEST_PORT) {
			throw new Error('UNITTEST_PORT is not defined');
		}

		const dbName = process.env.UNITTEST_DATABASE as string
		const dbName_old = `${dbName}_old`

		var result

		result = await db.insert(users).values({ fullName: 'Rick' });

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

		result = await dbNoDatabase.detach(dbName).atMilestone("old_milestone");

		result = await dbNoDatabase.attach(dbName);

		result = await db.insert(users).values({ fullName: 'Morty' });
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

		result = await db.select({
			fullName: users.fullName,
		}).from(users).orderBy(users.fullName);
		expect(result).toEqual([
			{fullName: 'Morty'},
			{fullName: 'Rick'},
		]);

		result = await dbNoDatabase.detach(dbName).atMilestone("new_milestone");

		result = await dbNoDatabase.attach(dbName).as(dbName_old).atMilestone("old_milestone");

		if (!process.env.UNITTEST_PORT) {
			throw new Error('UNITTEST_PORT is not defined');
		}
		const connectionOld = await mysql.createConnection({
			host: process.env.UNITTEST_HOST,
			port: parseInt(process.env.UNITTEST_PORT),
			user: process.env.UNITTEST_USER,
			password: process.env.UNITTEST_PASSWORD,
			database: dbName_old,
			multipleStatements: false,
		});
		const dbOld = drizzle(connectionOld, { schema, mode: "default"})

		result = await dbOld.select({
			fullName: users.fullName,
		}).from(users).orderBy(users.fullName);
		expect(result).toEqual([
			{fullName: 'Rick'},
		]);

		result = await dbNoDatabase.detach(dbName_old);

		result = await dbNoDatabase.attach(dbName_old).as(dbName).atMilestone("new_milestone");

		result = await db.select({
			fullName: users.fullName,
		}).from(users).orderBy(users.fullName);
		expect(result).toEqual([
			{fullName: 'Morty'},
			{fullName: 'Rick'},
		]);
	}, 60 * 1000);

	test('should detach and attach database with times', async () => {
		if (!process.env.UNITTEST_PORT) {
			throw new Error('UNITTEST_PORT is not defined');
		}

		const dbName = process.env.UNITTEST_DATABASE as string

		var result

		result = await connection.query(`SELECT NOW(6)`);
		const tStart = result[0][0]['NOW(6)'];

		await new Promise(resolve => setTimeout(resolve, 1000));

		result = await db.insert(users).values({ fullName: 'Jerry' });
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

		result = await db.select({
			fullName: users.fullName,
		}).from(users).orderBy(users.fullName);
		expect(result).toEqual([
			{fullName: 'Jerry'},
			{fullName: 'Morty'},
			{fullName: 'Rick'},
		]);

		result = await dbNoDatabase.detach(dbName);

		result = await dbNoDatabase.attach(dbName).atTime(tStart);

		result = await db.select({
			fullName: users.fullName,
		}).from(users).orderBy(users.fullName);
		expect(result).toEqual([
			{fullName: 'Morty'},
			{fullName: 'Rick'},
		]);
	}, 30 * 1000);
});
