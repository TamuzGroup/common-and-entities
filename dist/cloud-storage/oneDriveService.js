"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const qs = __importStar(require("qs"));
const auth_util_1 = require("./utils/auth.util");
class OneDriveService {
    constructor(clientId, clientSecret, redirectUrl, refreshToken) {
        this.clientId = clientId;
        this.redirectUrl = redirectUrl;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        this.auth = undefined;
    }
    // eslint-disable-next-line class-methods-use-this
    cloudAuth() {
        return null;
    }
    getAuthToken(code) {
        return new Promise((resolve) => {
            const options = {
                body: qs.stringify({
                    client_id: this.clientId,
                    redirect_uri: this.redirectUrl,
                    client_secret: this.clientSecret,
                    code,
                    grant_type: "authorization_code",
                }),
                headers: [["Content-Type", "application/x-www-form-urlencoded"]],
            };
            auth_util_1.axiosRequest("https://login.live.com/oauth20_token.srf", options).then((data) => {
                this.auth = data.data.access_token;
                resolve(data.data.access_token);
            });
        });
    }
    createFolder() {
        const options = {
            auth: this.auth,
        };
        return auth_util_1.axiosRequest("https://graph.microsoft.com/v1.0/drive/special/approot/children", options);
    }
    deleteFile(fileName) {
        const options = {
            auth: this.auth,
            method: "DELETE",
        };
        return auth_util_1.axiosRequest(`https://graph.microsoft.com/v1.0/drive/special/approot:/${fileName}`, options);
    }
    // eslint-disable-next-line class-methods-use-this
    downloadFile() {
        return Promise.resolve(null);
    }
    generateAuthUrl() {
        return `https://login.live.com/oauth20_authorize.srf?client_id=${this.clientId}&scope=Files.ReadWrite.AppFolder&response_type=code&redirect_uri=${this.redirectUrl}`;
    }
    getDriveFiles() {
        const options = {
            auth: this.auth,
        };
        return auth_util_1.axiosRequest("https://graph.microsoft.com/v1.0/drive/special/approot/children", options).then((data) => {
            return { data: { files: data.data } };
        });
    }
    getFileData(fileName) {
        const options = {
            auth: this.auth,
        };
        return auth_util_1.axiosRequest(`https://graph.microsoft.com/v1.0/drive/special/approot:/${fileName}:/thumbnails`, options).then((data) => {
            return data.data;
        });
    }
    saveFile(fileName, filePath) {
        const options = {
            method: "PUT",
            body: fs_1.default.createReadStream(filePath),
            auth: this.auth,
        };
        return auth_util_1.axiosRequest(`https://graph.microsoft.com/v1.0/drive/special/approot:/${fileName}:/content`, options);
    }
    // eslint-disable-next-line class-methods-use-this
    searchFolder() {
        return Promise.resolve(null);
    }
    // eslint-disable-next-line class-methods-use-this
    shareFile() {
        return Promise.resolve(null);
    }
}
exports.default = OneDriveService;
//# sourceMappingURL=oneDriveService.js.map