import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './src/schemaMigrate';

export async function connect(): Promise<[mysql.Connection, MySql2Database<Record<string, unknown>>]> {
    const connection = await mysql.createConnection({
        host: process.env.TESTAPP_HOST,
        port: parseInt(process.env.TESTAPP_PORT as string),
        user: process.env.TESTAPP_USER,
        password: process.env.TESTAPP_PASSWORD,
        database: "testapp_db",
        multipleStatements: false,
    });

    const db = drizzle(connection, { schema, mode: "default"})

    return [connection, db];
}
