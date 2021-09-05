import * as mongoConfig from "./config.json";

export interface IMongoDBConnectionSettings {
  user: string;
  password: string;
  host: string;
  protocol: string;
  port: number;
  authentication: string;
  db: string;
}

export function getMongoDBConnectionParams(
  env: string
): IMongoDBConnectionSettings {
  switch (env) {
    case "dev":
      return mongoConfig.mongoLocalSettings as IMongoDBConnectionSettings;
    case "prod":
      return mongoConfig.mongoSettings as IMongoDBConnectionSettings;
    default:
      return mongoConfig.mongoLocalSettings as IMongoDBConnectionSettings;
  }
}
