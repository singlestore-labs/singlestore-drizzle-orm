import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './src/schemaMigrate';

if (!process.env.TESTAPP_PORT) {
    throw new Error('TESTAPP_PORT is not defined');
}

export const connection = await mysql.createConnection({
    host: process.env.TESTAPP_HOST,
    port: parseInt(process.env.TESTAPP_PORT),
    user: process.env.TESTAPP_USER,
    password: process.env.TESTAPP_PASSWORD,
    database: "testapp_db",
    multipleStatements: false,
});

export const db = drizzle(connection, { schema, mode: "default"})
