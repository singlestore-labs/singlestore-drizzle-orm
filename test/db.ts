import { drizzle } from '../src/singlestore';

import mysql from 'mysql2/promise';
import * as schema from './test1/schema';

if (!process.env.UNITTEST_PORT) {
    throw new Error('UNITTEST_PORT is not defined');
}

export const connection = await mysql.createConnection({
    host: process.env.UNITTEST_HOST,
    port: parseInt(process.env.UNITTEST_PORT),
    user: process.env.UNITTEST_USER,
    password: process.env.UNITTEST_PASSWORD,
    database: process.env.UNITTEST_DATABASE,
    multipleStatements: false,
});

export const db = drizzle(connection, { schema, mode: "default"})
