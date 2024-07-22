import { drizzle } from '../src/singlestore';
import mysql from 'mysql2/promise';
import * as schema from './schema';

export const connection = await mysql.createConnection({
    host: 'svc-446b8c45-7bf8-4130-b24b-b4a98e5e253a-dml.aws-virginia-5.svc.singlestore.com',
    port: 3306,
    user: 'admin',
    password: 'IUW84L5JnPnqwEFYGgdPDm4x7pHJ4xHn',
    database: 'testdb_drizzle_orm',
    multipleStatements: false,
});

export const db = drizzle(connection, { schema, mode: "default"})
