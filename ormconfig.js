const DEVELOPMENT_ENV = process.env.NODE_ENV === "development";

const rootDir = DEVELOPMENT_ENV ? "src" : "build";

module.exports = {
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: DEVELOPMENT_ENV,
    logging: DEVELOPMENT_ENV,
    entities: [
        DEVELOPMENT_ENV
            ? "src/entities/**/*{.ts, .js}"
            : "build/entities/**/*.js",
    ],
    migrations: [
        DEVELOPMENT_ENV
            ? "src/migrations/**/*{.ts, .js}"
            : "build/migrations/**/*.js",
    ],
    subscribers: [
        DEVELOPMENT_ENV
            ? "src/subscribers/**/*{.ts, .js}"
            : "build/subscribers/**/*.js",
    ],
    cli: {
        entitiesDir: `${rootDir}/entities`,
        migrationsDir: `${rootDir}/migrations`,
        subscribersDir: `${rootDir}/subscribers`,
    },
};
