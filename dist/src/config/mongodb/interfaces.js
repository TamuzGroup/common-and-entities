"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDBConnectionParams = void 0;
const config_json_1 = __importDefault(require("./config.json"));
function getMongoDBConnectionParams(env) {
    switch (env) {
        case "dev":
            return config_json_1.default.mongoLocalSettings;
        case "prod":
            return config_json_1.default.mongoSettings;
        default:
            return config_json_1.default.mongoLocalSettings;
    }
}
exports.getMongoDBConnectionParams = getMongoDBConnectionParams;
//# sourceMappingURL=interfaces.js.map