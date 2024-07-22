// Run
// npx tsx test/test1/migrate.ts 
// to apply the migrations to the database.
// You should not need to run this, since the tests should always run the migrations before running the tests.

import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, connection } from '../db';

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: 'test/test1/migrations' });

// Don't forget to close the connection, otherwise the script will hang
await connection.end();
