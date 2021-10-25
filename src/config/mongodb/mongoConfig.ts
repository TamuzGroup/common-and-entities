const mongoConfig = require("./config.json");
import IMongoDBConnectionSettings from "./interfaces"

export function getMongoDBConnectionParams(env: string ): IMongoDBConnectionSettings {
    switch (env) {
        case "dev":
            return mongoConfig.mongoLocalSettings as IMongoDBConnectionSettings;
        case "prod":
            return mongoConfig.mongoSettings as IMongoDBConnectionSettings;
        default:
            return mongoConfig.mongoLocalSettings as IMongoDBConnectionSettings;
    }
}
