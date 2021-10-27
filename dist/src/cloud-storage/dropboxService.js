"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const dropbox_1 = require("dropbox");
const fs_1 = __importDefault(require("fs"));
const constants_1 = __importDefault(require("./constants"));
class DropboxService {
    constructor(clientId, clientSecret, redirectUrl, refreshToken) {
        this.refreshToken = refreshToken;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
        this.auth = new dropbox_1.DropboxAuth({
            fetch: node_fetch_1.default,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
        });
        this.dropbox = this.cloudAuth();
    }
    cloudAuth() {
        if (this.refreshToken != null) {
            this.auth.setRefreshToken(this.refreshToken);
        }
        return new dropbox_1.Dropbox({
            auth: this.auth,
        });
    }
    getAuthToken(code) {
        return new Promise((resolve) => {
            if (typeof code === "string") {
                this.auth
                    .getAccessTokenFromCode(this.redirectUrl, code)
                    .then((token) => {
                    const { refresh_token: refreshToken } = token.result;
                    if (refreshToken != null) {
                        this.auth.setRefreshToken(refreshToken);
                        const authData = {
                            refreshToken,
                            cloud: constants_1.default.CLOUDS.DROPBOX,
                        };
                        return resolve(authData);
                    }
                });
            }
        });
    }
    generateAuthUrl() {
        return this.auth.getAuthenticationUrl(this.redirectUrl, "", "code", "offline", [], "none", false);
    }
    createFolder(folderName) {
        return this.dropbox.filesCreateFolderV2({
            path: `/${folderName}`,
            autorename: false,
        });
    }
    deleteFile(fileId) {
        return this.dropbox.filesDeleteV2({
            path: fileId,
        });
    }
    downloadFile(fileId) {
        return this.dropbox.filesDownload({
            path: fileId,
        });
    }
    getDriveFiles(folderId) {
        return this.dropbox
            .filesListFolder({
            path: folderId || "",
            include_mounted_folders: true,
        })
            .then((rsp) => {
            return {
                files: rsp.result.entries,
                tokenData: {
                    refreshToken: this.refreshToken,
                    cloudType: constants_1.default.CLOUDS.DROPBOX,
                },
            };
        });
    }
    getFileData(fileId) {
        return this.dropbox
            .sharingListSharedLinks({
            path: fileId,
        })
            .then((rsp) => {
            const url = rsp.result.links[0].url.split("?");
            return {
                data: `${url}?raw=1`,
            };
        });
    }
    async saveFile(fileName, filePath) {
        return this.dropbox.filesUpload({
            path: `/${fileName}`,
            contents: fs_1.default.createReadStream(filePath || fileName),
            autorename: false,
            mode: { ".tag": "add" },
        });
    }
    // eslint-disable-next-line class-methods-use-this
    searchFolder() {
        return Promise.resolve(null);
    }
}
exports.default = DropboxService;
//# sourceMappingURL=dropboxService.js.map