// Run
// npx drizzle-kit generate --config test/test1/drizzle.config.ts 
// to generate the migrations folder for test1.

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.UNITTEST_HOST as string,
        port: parseInt(process.env.UNITTEST_PORT as string),
        user: process.env.UNITTEST_USER as string,
        password: process.env.UNITTEST_PASSWORD as string,
        database: process.env.UNITTEST_DATABAS as string
    },
    schema: "test/test2/schema.ts",
    out: "test/test2/migrations"
});
