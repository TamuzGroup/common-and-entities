const config = require("./config.json");

export interface IMongoDBConnectionSettings {
    user: string;
    password: string;
    host: string;
    protocol: string;
    port: number;
    authentication: string;
    db: string;
}

export function getMongoDBConnectionParams(env: string ): IMongoDBConnectionSettings {
    switch (env) {
        case "dev":
        case "development":
            return config.mongoLocalSettings as IMongoDBConnectionSettings;
        case "prod":
            return config.mongoSettings as IMongoDBConnectionSettings;
        default:
            return config.mongoLocalSettings as IMongoDBConnectionSettings;
    }
}