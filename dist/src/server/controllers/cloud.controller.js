"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const cloud_service_1 = require("../services/cloud.service");
const constants_1 = __importDefault(require("../../cloud-storage/constants"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const upload = multer_1.default({
    dest: "./",
}).single("file");
const cloudAuth = catchAsync_1.default(async (req, res) => {
    const { accessToken } = req.headers;
    const { cloud } = req.query;
    const url = await cloud_service_1.generateAuthUrl(cloud, accessToken);
    res.status(http_status_1.default.CREATED).send(url);
});
const cloudCallback = catchAsync_1.default(async (req, res) => {
    const { code } = req.query;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user && req.user._id;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userName = req.user && req.user.name;
    if (code) {
        const authData = await cloud_service_1.authCallback(code, userId, userName);
        logger_util_1.default.info({ authData });
        res.redirect(`${constants_1.default.REDIRECT_AFTER_CLOUD_AUTH}`);
    }
    else {
        logger_util_1.default.error("The code does not exist");
    }
});
const getFilesList = catchAsync_1.default(async (req, res) => {
    const { folderId, isRenderChildren, cloudType, userId } = req.body;
    const { cloudtoken: cloudToken } = req.headers;
    const files = await cloud_service_1.getDriveFiles(folderId, isRenderChildren, cloudToken, cloudType, userId);
    res.status(http_status_1.default.CREATED).send(files);
});
const uploadFile = catchAsync_1.default(async (req, res) => {
    upload(req, res, async (err) => {
        const { parentId, cloudType, userId } = req.query;
        const { cloudtoken: cloudToken } = req.headers;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { originalname: originalName, path, mimetype } = req.file;
        if (err) {
            logger_util_1.default.error(`upload file: ${err}`);
        }
        const data = await cloud_service_1.saveFile(originalName, path, mimetype, parentId, cloudToken, cloudType, userId);
        fs_1.default.unlinkSync(path);
        res.status(http_status_1.default.CREATED).send(data);
    });
});
const deleteFile = catchAsync_1.default(async (req, res) => {
    const { fileId, fileName } = req.body;
    const file = await cloud_service_1.deleteFileById(fileId, fileName);
    res.status(http_status_1.default.CREATED).send(file);
});
const downloadFile = catchAsync_1.default(async (req, res) => {
    const { fileId, fileName } = req.body;
    const file = await cloud_service_1.downloadFileById(fileId, fileName);
    res.status(http_status_1.default.CREATED).send(file);
});
const cloudController = {
    cloudAuth,
    cloudCallback,
    getFilesList,
    uploadFile,
    deleteFile,
    downloadFile,
};
exports.default = cloudController;
//# sourceMappingURL=cloud.controller.js.map