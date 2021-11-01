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
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const cloud_service_1 = require("../services/cloud.service");
const constants_1 = __importDefault(require("../../cloud-storage/constants"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
const cloudAuth = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken } = req.headers;
    const { cloud } = req.query;
    const url = yield cloud_service_1.generateAuthUrl(cloud, accessToken);
    res.status(http_status_1.default.CREATED).send(url);
}));
const cloudCallback = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const userId = req.user && req.user._id;
    if (code) {
        const authData = yield cloud_service_1.authCallback(code, userId);
        logger_util_1.default.info({ authData });
        res.redirect(`${constants_1.default.REDIRECT_AFTER_CLOUD_AUTH}`);
    }
    else {
        logger_util_1.default.error("The code does not exist");
    }
}));
const getFilesList = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId, isRenderChildren, cloudType, userId } = req.body;
    const { cloudtoken: cloudToken } = req.headers;
    const files = yield cloud_service_1.getDriveFiles(folderId, isRenderChildren, cloudToken, cloudType, userId);
    res.status(http_status_1.default.CREATED).send(files);
}));
const cloudController = {
    cloudAuth,
    cloudCallback,
    getFilesList,
};
exports.default = cloudController;
//# sourceMappingURL=cloud.controller.js.map