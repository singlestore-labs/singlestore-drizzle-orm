import { beforeEach, expect, test, describe } from 'vitest'

import { connect } from '../db';
import { migrate } from 'drizzle-orm/singlestore/migrator';
import { users } from './schema';
import { drizzle } from 'drizzle-orm/singlestore';
import * as schema from './schema';
import mysql from 'mysql2/promise';
import { DrizzleError } from 'drizzle-orm';

interface LocalTestContext {
	connectionNoDatabase: mysql.Connection;
	dbNoDatabase: ReturnType<typeof drizzle>;
	connection: mysql.Connection;
	db: ReturnType<typeof drizzle>;
	dbName: string;
	dbName_old: string;
}

beforeEach<LocalTestContext>(async (context) => {
	context.dbName = "testdb_drizzle_orm"
	context.dbName_old = "testdb_drizzle_orm_old"

	const [connectionNoDatabase, dbNoDatabase] = await connect();
	context.connectionNoDatabase = connectionNoDatabase;
	context.dbNoDatabase = dbNoDatabase

	await connectionNoDatabase.query(`DROP DATABASE IF EXISTS ${context.dbName}`);
	await connectionNoDatabase.query(`DROP DATABASE IF EXISTS ${context.dbName_old}_old`);
	await connectionNoDatabase.query(`CREATE DATABASE ${context.dbName}`);

	const [connection, db] = await connect(context.dbName);
	context.connection = connection;
	context.db = db;

	await migrate(db, { migrationsFolder: 'test/test1/migrations' });
}, 60 * 1000);

describe('attach and detach', async () => {
	test<LocalTestContext>('should detach and attach database', async ({dbName, dbNoDatabase}) => {
		var result

		result = await dbNoDatabase.detach(dbName);

		// TODO(singlestore): format this response in a pretty way, so we can get `result.milestone_name`

		result = await dbNoDatabase.attach(dbName);
	}, 30 * 1000);

	test<LocalTestContext>('should detach and attach database with milestones', async ({dbName, dbName_old, db, dbNoDatabase}) => {
		if (!process.env.UNITTEST_PORT) {
			throw new Error('UNITTEST_PORT is not defined');
		}

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

	test<LocalTestContext>('should detach and attach database with times', async ({dbName, connection, db, dbNoDatabase}) => {
		if (!process.env.UNITTEST_PORT) {
			throw new Error('UNITTEST_PORT is not defined');
		}

		var result

		result = await db.insert(users).values([
			{ fullName: 'Rick' },
			{ fullName: 'Morty' },
		]);
		expect(result).toEqual([
			{
				fieldCount: 0,
				affectedRows: 2,
				serverStatus: 2,
				warningStatus: 0,
				changedRows: 0,
				info: '&Records: 2  Duplicates: 0  Warnings: 0',
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

		await new Promise(resolve => setTimeout(resolve, 1000));

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

	test<LocalTestContext>('should use create and drop milestones', async ({dbName, db, dbNoDatabase}) => {
		if (!process.env.UNITTEST_PORT) {
			throw new Error('UNITTEST_PORT is not defined');
		}

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

		result = await dbNoDatabase.createMilestone("old_milestone").for(dbName);

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

		result = await dbNoDatabase.createMilestone("new_milestone").for(dbName);

		result = await dbNoDatabase.detach(dbName);

		result = await dbNoDatabase.attach(dbName).atMilestone("old_milestone");

		result = await db.select({
			fullName: users.fullName,
		}).from(users).orderBy(users.fullName);
		expect(result).toEqual([
			{fullName: 'Rick'},
		]);

		result = await dbNoDatabase.dropMilestone("old_milestone").for(dbName);

		result = await dbNoDatabase.detach(dbName);

		await expect((async () => {
			await dbNoDatabase.attach(dbName).atMilestone("old_milestone")
		})()).rejects.toThrowError(RegExp('Milestone "old_milestone" for database testdb_drizzle_orm does not exist'));

		result = await dbNoDatabase.attach(dbName).atMilestone("new_milestone");

		result = await db.select({
			fullName: users.fullName,
		}).from(users).orderBy(users.fullName);
		expect(result).toEqual([
			{fullName: 'Morty'},
			{fullName: 'Rick'},
		]);
	}, 60 * 1000);

	test<LocalTestContext>('should not be able to attach at time and at milestone', async ({dbNoDatabase}) => {
		expect(() => {
			dbNoDatabase.attach("testdb_drizzle_orm")
				.atTime(new Date("2021-01-01T00:00:00.000Z"))
				.atMilestone("old_milestone")
		}).toThrowError(new DrizzleError({ message: 'Cannot set both time and milestone' }));
	});
});

describe('optimize table', async () => {
	test<LocalTestContext>('optimize table', async ({db}) => {
		var result

		result = await db.optimizeTable(users);

		result = await db.optimizeTable(users, 'FULL');

		result = await db.optimizeTable(users, 'FLUSH');

		result = await db.optimizeTable(users, 'FIX_ALTER');

		result = await db.optimizeTable(users, 'INDEX');

		result = await db.optimizeTable(users).warmBlobCacheForColumn(users.fullName);

		result = await db.optimizeTable(users).warmBlobCacheForColumn(users.fullName, users.id);

		result = await db.optimizeTable(users).warmBlobCacheForColumn();

		expect(() => {
			db.optimizeTable(users, 'FULL').warmBlobCacheForColumn(users.fullName);
		}).toThrowError('Cannot call warmBlobCacheForColumn with an argument');
	})
});
