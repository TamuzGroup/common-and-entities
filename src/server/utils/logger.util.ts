import config from "../config/config";
import pJson from "../../../package.json";

const { Logger, LOG_LEVELS } = require("package-logger");
const logger = new Logger(pJson.name, config.env, LOG_LEVELS.WARNING_LEVEL);

// class TempLogger {
//     getVersion() {
//         return "1.1.t";
//     }
//     info(...data:any[]) { console.info(...data); };
//     error(...data:any[]) { console.info(...data); };
//     warn(...data:any[]) { console.info(...data); };
// }
//
// const logger = new TempLogger();

logger.info(`Logger version is ${logger.getVersion()}`);

export default logger;