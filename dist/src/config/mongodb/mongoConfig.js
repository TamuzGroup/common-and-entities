"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDBConnectionParams = void 0;
const config = require("./config.json");
function getMongoDBConnectionParams(env) {
    switch (env) {
        case "dev":
            return config.mongoLocalSettings;
        case "prod":
            return config.mongoSettings;
        default:
            return config.mongoLocalSettings;
    }
}
exports.getMongoDBConnectionParams = getMongoDBConnectionParams;
//# sourceMappingURL=mongoConfig.js.map