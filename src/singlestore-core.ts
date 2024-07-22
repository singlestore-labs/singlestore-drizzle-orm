export * from 'drizzle-orm/mysql-core';

import {
	mysqlTable,
	MySqlRawQueryResult
} from 'drizzle-orm/mysql-core';

export const singlestoreTable = mysqlTable;

export type SinglestoreRawQueryResult = MySqlRawQueryResult;
