"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const package_json_1 = __importDefault(require("../../../package.json"));
const { Logger, LOG_LEVELS } = require("package-logger");
const logger = new Logger(package_json_1.default.name, config_1.default.env, LOG_LEVELS.WARNING_LEVEL);
logger.info(`Logger version is ${logger.getVersion()}`);
exports.default = logger;
//# sourceMappingURL=logger.util.js.map