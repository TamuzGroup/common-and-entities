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
const node_fetch_1 = __importDefault(require("node-fetch"));
const dropbox_1 = require("dropbox");
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
        return new dropbox_1.Dropbox({
            auth: this.auth,
        });
    }
    getAuthToken(code) {
        this.auth
            .getAccessTokenFromCode(this.redirectUrl, code)
            .then((token) => {
            // @ts-ignore
            const { refresh_token: refreshToken } = token.result;
            if (refreshToken != null) {
                this.auth.setRefreshToken(refreshToken);
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
    getDriveFiles(folderPath) {
        return this.dropbox
            .filesListFolder({
            path: folderPath,
        })
            .then((rsp) => {
            return {
                data: { files: rsp.result.entries },
            };
        });
    }
    getFileData(fileId) {
        return this.dropbox
            .sharingListSharedLinks({
            path: fileId,
        })
            .then((rsp) => {
            return {
                data: { url: rsp.result.links[0].url },
            };
        });
    }
    saveFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dropbox.filesUpload({
                path: `/${fileName}`,
                autorename: false,
                mode: { ".tag": "add" },
            });
        });
    }
    searchFolder(folderName) {
        return Promise.resolve(null);
    }
    shareFile(fileId, email, role, type) {
        return Promise.resolve(null);
    }
}
exports.default = DropboxService;
//# sourceMappingURL=dropboxService.js.map