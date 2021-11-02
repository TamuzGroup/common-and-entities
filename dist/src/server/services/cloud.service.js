"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCallback = exports.generateAuthUrl = void 0;
const constants_1 = __importDefault(require("../../cloud-storage/constants"));
const googleDrive_1 = __importDefault(require("../../cloud-storage/googleDrive"));
const dropboxService_1 = __importDefault(require("../../cloud-storage/dropboxService"));
const oneDriveService_1 = __importDefault(require("../../cloud-storage/oneDriveService"));
const config_1 = __importDefault(require("../config/config"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const cloudStorageTokenMng_producer_1 = require("../../kafka/dedicated-producers/cloudStorageTokenMng.producer");
let cloudService;
const REDIRECT_URL = "http://localhost:3000/v1/cloud/callback";
const generateAuthUrl = (cloud, accessToken) => {
    switch (cloud) {
        case constants_1.default.CLOUDS.GOOGLE: {
            cloudService = new googleDrive_1.default(config_1.default.googleCloudSettings.clientId, config_1.default.googleCloudSettings.clientSecret, REDIRECT_URL, null);
            break;
        }
        case constants_1.default.CLOUDS.DROPBOX: {
            cloudService = new dropboxService_1.default(config_1.default.dropboxCloudSettings.clientId, config_1.default.dropboxCloudSettings.clientSecret, REDIRECT_URL, accessToken);
            break;
        }
        case constants_1.default.CLOUDS.ONEDRIVE: {
            cloudService = new oneDriveService_1.default(config_1.default.onedriveCloudSettings.clientId, config_1.default.onedriveCloudSettings.clientSecret, REDIRECT_URL, null);
            break;
        }
        default:
            return true;
    }
    return cloudService.generateAuthUrl();
};
exports.generateAuthUrl = generateAuthUrl;
const authCallback = (code, userId) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authData = yield cloudService.getAuthToken(code);
            yield cloudStorageTokenMng_producer_1.sendMessage(authData, userId);
            resolve({ refreshToken: authData.refreshToken, cloud: authData.cloud });
        }
        catch (e) {
            logger_util_1.default.error(e);
        }
    }));
};
exports.authCallback = authCallback;
//# sourceMappingURL=cloud.service.js.map