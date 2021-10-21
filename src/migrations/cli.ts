import { mongoMigrateCli } from "mongo-migrate-ts";
import { getMongoDBConnectionParams } from "../config/mongodb/interfaces";

const [env] = process.argv.splice(2, 1);
const mongoDBConfig = getMongoDBConnectionParams(env);
const dbURL = `${mongoDBConfig.protocol}://${mongoDBConfig.user}:${mongoDBConfig.password}@${mongoDBConfig.host}:${mongoDBConfig.port}`;

mongoMigrateCli({
  uri: dbURL,
  database: mongoDBConfig.db,
  migrationsDir: `${__dirname}/commits`,
  migrationsCollection: "migrations_collection",
});
