import 'dotenv/config';
import { migrate } from '@drodrigues4/drizzle-orm/singlestore/migrator';
import { db, connection } from './db';

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: 'app/migrations' });

// Don't forget to close the connection, otherwise the script will hang
await connection.end();
