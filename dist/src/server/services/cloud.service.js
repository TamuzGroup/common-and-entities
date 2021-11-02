"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFileById = exports.deleteFileById = exports.saveFile = exports.getDriveFiles = exports.authCallback = exports.generateAuthUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = __importDefault(require("../../cloud-storage/constants"));
const googleDrive_1 = __importDefault(require("../../cloud-storage/googleDrive"));
const dropboxService_1 = __importDefault(require("../../cloud-storage/dropboxService"));
const oneDriveService_1 = __importDefault(require("../../cloud-storage/oneDriveService"));
const config_1 = __importDefault(require("../config/config"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const cloudStorageTokenMng_producer_1 = require("../../kafka/dedicated-producers/cloudStorageTokenMng.producer");
const helper_util_1 = __importDefault(require("../utils/helper.util"));
let cloudService;
const REDIRECT_URL = "http://localhost:3000/v1/cloud/callback";
const getCloudToken = (userId) => {
    return axios_1.default.post("http://localhost:3001/v1/token/get-token", {
        userId,
    });
};
const getCloudService = (cloudType, refreshToken) => {
    switch (cloudType) {
        case constants_1.default.CLOUDS.GOOGLE: {
            cloudService = new googleDrive_1.default(config_1.default.googleCloudSettings.clientId, config_1.default.googleCloudSettings.clientSecret, REDIRECT_URL, refreshToken);
            break;
        }
        case constants_1.default.CLOUDS.DROPBOX: {
            cloudService = new dropboxService_1.default(config_1.default.dropboxCloudSettings.clientId, config_1.default.dropboxCloudSettings.clientSecret, REDIRECT_URL, refreshToken);
            break;
        }
        case constants_1.default.CLOUDS.ONEDRIVE: {
            cloudService = new oneDriveService_1.default(config_1.default.onedriveCloudSettings.clientId, config_1.default.onedriveCloudSettings.clientSecret, REDIRECT_URL, refreshToken);
            break;
        }
        default:
            return true;
    }
};
// This function connects to the cloud service through two parameters that come from the client.
// The parameters are saved in sessionStorage in client after user does auth.
// If no parameters are reached, we will call the safe box service to obtain the token data of the same user
const connectToServiceByCloud = (cloud, refresh_token, userId) => {
    let refreshToken = refresh_token;
    let cloudType = cloud;
    return new Promise((resolve) => {
        if (!refresh_token) {
            getCloudToken(userId)
                .then((rsp) => {
                const { cloud_type: userCloud } = rsp.data;
                const [token] = rsp.data.tokens;
                refreshToken = token;
                cloudType = userCloud;
                getCloudService(cloudType, refreshToken);
                resolve(true);
            })
                .catch((err) => {
                logger_util_1.default.error(`get token: ${err}`);
            });
        }
        else {
            getCloudService(cloudType, refreshToken);
            resolve(true);
        }
    });
};
const generateAuthUrl = async (cloud, cloudToken) => {
    getCloudService(cloud, cloudToken);
    return cloudService.generateAuthUrl();
};
exports.generateAuthUrl = generateAuthUrl;
const authCallback = (code, userId, userName) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        try {
            const authData = await cloudService.getAuthToken(code);
            await cloudStorageTokenMng_producer_1.sendMessage(authData, userId);
            const pdfText = `welcome ${userName}`;
            const fileName = "welcome.pdf";
            helper_util_1.default.createPdf(pdfText, fileName);
            await cloudService.saveFile(fileName);
            fs_1.default.unlinkSync(fileName);
            resolve({ refreshToken: authData.refreshToken, cloud: authData.cloud });
        }
        catch (err) {
            logger_util_1.default.error(`cloud callback: ${err}`);
        }
    });
};
exports.authCallback = authCallback;
const getDriveFiles = async (folderId, isRenderChildren, cloudToken, cloudType, userId) => {
    await connectToServiceByCloud(cloudType, cloudToken, userId);
    return cloudService.getDriveFiles(folderId, isRenderChildren);
};
exports.getDriveFiles = getDriveFiles;
const saveFile = async (originalName, path, mimetype, parentId, cloudToken, cloudType, userId) => {
    await connectToServiceByCloud(cloudType, cloudToken, userId);
    return cloudService.saveFile(originalName, path, mimetype, parentId);
};
exports.saveFile = saveFile;
const deleteFileById = async (fileId, fileName, cloudToken, cloudType, userId) => {
    await connectToServiceByCloud(cloudType, cloudToken, userId);
    return cloudService.deleteFile(fileId, fileName);
};
exports.deleteFileById = deleteFileById;
const downloadFileById = async (fileId, fileName, cloudToken, cloudType, userId) => {
    await connectToServiceByCloud(cloudType, cloudToken, userId);
    return cloudService.downloadFile(fileId, fileName);
};
exports.downloadFileById = downloadFileById;
//# sourceMappingURL=cloud.service.js.map