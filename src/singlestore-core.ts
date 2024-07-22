export * from 'drizzle-orm/mysql-core';

import { mysqlTable } from 'drizzle-orm/mysql-core';
import { type MySqlRawQueryResult } from "drizzle-orm/mysql2"

export const singlestoreTable = mysqlTable;

export type SinglestoreRawQueryResult = MySqlRawQueryResult;
