"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const qs_1 = __importDefault(require("qs"));
const auth_util_1 = require("./utils/auth.util");
const constants_1 = __importDefault(require("./constants"));
const BASE_URL = "https://graph.microsoft.com/v1.0/drive/";
class OneDriveService {
    constructor(clientId, clientSecret, redirectUrl, refreshToken) {
        this.clientId = clientId;
        this.redirectUrl = redirectUrl;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        this.auth = null;
    }
    // eslint-disable-next-line class-methods-use-this
    cloudAuth() {
        return null;
    }
    getAuthToken(code) {
        return new Promise((resolve) => {
            const options = {
                body: qs_1.default.stringify({
                    client_id: this.clientId,
                    redirect_uri: this.redirectUrl,
                    client_secret: this.clientSecret,
                    code,
                    grant_type: "authorization_code",
                }),
                headers: [["Content-Type", "application/x-www-form-urlencoded"]],
            };
            auth_util_1.axiosRequest(constants_1.default.ONE_DRIVE_GET_TOKEN_URL, options).then((data) => {
                this.auth = data.refresh_token;
                const authData = {
                    refreshToken: data.refresh_token,
                    cloud: "onedrive",
                };
                resolve(authData);
            });
        });
    }
    createFolder() {
        const options = {
            auth: this.auth,
        };
        return auth_util_1.axiosRequest(`${BASE_URL}special/approot/children`, options);
    }
    deleteFile(fileName) {
        const options = {
            auth: this.auth,
            method: "DELETE",
        };
        return auth_util_1.axiosRequest(`${BASE_URL}special/approot:/${fileName}`, options);
    }
    // eslint-disable-next-line class-methods-use-this
    downloadFile() {
        return Promise.resolve(null);
    }
    generateAuthUrl() {
        return `${constants_1.default.ONE_DRIVE_AUTHORIZE_URL}?client_id=${this.clientId}&scope=Files.ReadWrite.AppFolder&response_type=code&redirect_uri=${this.redirectUrl}`;
    }
    getDriveFiles(folderIdOrName, isRenderChildren) {
        const options = {
            auth: this.auth,
        };
        const isRenderChildrenItems = isRenderChildren === "true";
        const url = isRenderChildrenItems
            ? `${BASE_URL}special/approot:/${folderIdOrName}:/children`
            : `${BASE_URL}special/approot/children`;
        return auth_util_1.axiosRequest(url, options).then((rsp) => {
            const treeData = rsp.value.map((item) => {
                return Object.assign(Object.assign({}, item), { ".tag": item.folder ? "folder" : "file" });
            });
            return { data: treeData };
        });
    }
    getFileData(fileName) {
        const options = {
            auth: this.auth,
        };
        return auth_util_1.axiosRequest(`${BASE_URL}special/approot:/${fileName}:/thumbnails`, options).then((data) => {
            return data.data;
        });
    }
    saveFile(fileName, filePath) {
        const options = {
            method: "PUT",
            body: fs_1.default.createReadStream(filePath),
            auth: this.auth,
        };
        return auth_util_1.axiosRequest(`${BASE_URL}special/approot:/${fileName}:/content`, options);
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