"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_migrate_ts_1 = require("mongo-migrate-ts");
const mongoConfig_1 = require("../config/mongodb/mongoConfig");
const [env] = process.argv.splice(2, 1);
const mongoDBConfig = mongoConfig_1.getMongoDBConnectionParams(env);
const dbURL = `${mongoDBConfig.protocol}://${mongoDBConfig.user}:${mongoDBConfig.password}@${mongoDBConfig.host}:${mongoDBConfig.port}`;
mongo_migrate_ts_1.mongoMigrateCli({
    uri: dbURL,
    database: mongoDBConfig.db,
    migrationsDir: `${__dirname}/commits`,
    migrationsCollection: "migrations_collection",
});
//# sourceMappingURL=cli.js.map