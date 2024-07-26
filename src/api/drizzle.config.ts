import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.TESTAPP_HOST as string,
        port: parseInt(process.env.TESTAPP_PORT as string),
        user: process.env.TESTAPP_USER,
        password: process.env.TESTAPP_PASSWORD,
        database: process.env.TESTAPP_DATABASE as string
    },
    schema: "src/api/schemaMigrate.ts",
    out: "src/api/migrations"
});
