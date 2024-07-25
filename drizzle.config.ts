import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'mysql',
    dbCredentials: {
        host: 'svc-5e48bb1e-b3bc-4a9d-be77-d9ac46c59315-dml.aws-virginia-5.svc.singlestore.com',
        port: 3306,
        user: 'admin',
        password: 'lqA6aQebwzWMzJ3y1QLp6MAo9vHntJ9L',
        database: 'testdb_drizzle_orm'
    },
    schema: "app/src/schema.ts",
    out: "app/migrations"
});
