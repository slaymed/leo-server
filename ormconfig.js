const DEVELOPMENT_ENV = process.env.NODE_ENV === "development";

const rootDir = DEVELOPMENT_ENV ? "src" : "build";

module.exports = {
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    synchronize: DEVELOPMENT_ENV,
    logging: DEVELOPMENT_ENV,
    entities: [rootDir + "/entities/**/*{.ts, .js}"],
    migrations: [rootDir + "/migrations/**/*{.ts, .js}"],
    subscribers: [rootDir + "/subscribers/**/*{.ts, .js}"],
    cli: {
        entitiesDir: rootDir + "/entities",
        migrationsDir: rootDir + "/migrations",
        subscribersDir: rootDir + "/subscribers",
    },
};
