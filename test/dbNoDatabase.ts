import { drizzle } from '@drodrigues4/drizzle-orm/singlestore';

import mysql from 'mysql2/promise';
import * as schema from './test1/schema';

if (!process.env.UNITTEST_PORT) {
    throw new Error('UNITTEST_PORT is not defined');
}

export const connectionNoDatabase = await mysql.createConnection({
    host: process.env.UNITTEST_HOST,
    port: parseInt(process.env.UNITTEST_PORT),
    user: process.env.UNITTEST_USER,
    password: process.env.UNITTEST_PASSWORD,
    multipleStatements: false,
});

export const dbNoDatabase = drizzle(connectionNoDatabase, { schema, mode: "default"})
