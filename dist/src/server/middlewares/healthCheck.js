"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const config_1 = __importDefault(require("../config/config"));
const isHealthCheckAuthorized = (req, res, next) => {
    const { adminKey, to } = req.body;
    if (adminKey !== config_1.default.admin.pass)
        next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized"));
    else if (!to)
        next(new ApiError_1.default(http_status_1.default.BAD_REQUEST, '"to" parameter is required'));
    else
        next();
};
const healthCheckMiddleware = {
    isHealthCheckAuthorized,
};
exports.default = healthCheckMiddleware;
//# sourceMappingURL=healthCheck.js.map