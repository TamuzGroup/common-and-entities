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
const googleapis_1 = require("googleapis");
const fs = __importStar(require("fs"));
const constants_1 = __importDefault(require("./constants"));
class GoogleDriveService {
    constructor(clientId, clientSecret, redirectUrl, refreshToken) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
        this.refreshToken = refreshToken;
        const [auth, drive] = this.cloudAuth();
        this.auth = auth;
        this.drive = drive;
    }
    cloudAuth() {
        const auth = new googleapis_1.google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUrl);
        if (this.refreshToken)
            auth.setCredentials({ refresh_token: this.refreshToken });
        const drive = googleapis_1.google.drive({ version: "v3", auth });
        return [auth, drive];
    }
    createFolder(folderName, parentId) {
        const params = {
            requestBody: Object.assign({ name: folderName, mimeType: constants_1.default.GOOGLE_FOLDER_PATH }, (parentId && { parents: [parentId] })),
            fields: "id, name",
        };
        return this.drive.files.create(params);
    }
    searchFolder(folderName) {
        return new Promise((resolve, reject) => {
            return this.drive.files.list({
                q: `mimeType='${constants_1.default.GOOGLE_FOLDER_PATH}' and name='${folderName}'`,
                fields: "files(id, name)",
            }, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res) {
                    const restData = res.data.files ? res.data.files[0] : null;
                    return resolve(restData);
                }
            });
        });
    }
    saveFile(fileName, filePath, fileMimeType, folderId) {
        const params = {
            requestBody: {
                name: fileName,
                parents: folderId ? [folderId] : [],
            },
            media: {
                mimeType: fileMimeType,
                body: fs.createReadStream(filePath),
            },
        };
        return this.drive.files.create(params);
    }
    getChildren(folderId) {
        const params = Object.assign(Object.assign({ auth: this.auth, pageSize: 1000, spaces: "appDataFolder" }, (folderId && { q: `'${folderId}' in parents and trashed=false` })), { fields: "files(id, name, parents, mimeType)" });
        return this.drive.files.list(params).then((rsp) => {
            const { files } = rsp.data;
            const filesData = files !== null && files !== undefined ? files : [];
            const filteredFiles = filesData.map((item) => {
                return Object.assign(Object.assign({}, item), { ".tag": item.mimeType === constants_1.default.GOOGLE_FOLDER_PATH ? "folder" : "file" });
            });
            return {
                data: filteredFiles,
            };
        });
    }
    getDriveFiles(folderIdOrName, isRenderChildren) {
        const params = Object.assign(Object.assign({ auth: this.auth, pageSize: 1000, spaces: "appDataFolder" }, (folderIdOrName && {
            q: `'${folderIdOrName}' in parents and trashed=false`,
        })), { fields: "files(id, name, parents, mimeType)" });
        const isRenderChildrenItems = isRenderChildren === "true";
        return this.drive.files.list(params).then((rsp) => {
            const { files } = rsp.data;
            const filesData = files !== null && files !== undefined ? files : [];
            let filteredFiles = [];
            if (!isRenderChildrenItems) {
                filteredFiles = filesData.filter((item) => item.parents && item.parents[0] === folderIdOrName);
            }
            filteredFiles = filteredFiles.map((item) => {
                return Object.assign(Object.assign({}, item), { ".tag": item.mimeType === constants_1.default.GOOGLE_FOLDER_PATH ? "folder" : "file" });
            });
            return {
                files: filteredFiles,
                tokenData: {
                    refreshToken: this.refreshToken,
                    cloudType: constants_1.default.CLOUDS.DROPBOX,
                },
            };
        });
    }
    getAuthToken(code) {
        return new Promise((resolve) => {
            return this.auth.getToken(code, (err, tokens) => {
                if (tokens && tokens.refresh_token) {
                    this.auth.setCredentials(tokens);
                    const authData = {
                        refreshToken: tokens.refresh_token,
                        cloud: constants_1.default.CLOUDS.GOOGLE,
                    };
                    return resolve(authData);
                }
            });
        });
    }
    async deleteFile(fileId) {
        const params = {
            fileId,
        };
        return this.drive.files.delete(params);
    }
    downloadFile(fileId) {
        return this.drive.files.get({
            fileId,
            alt: "media",
        }, {
            responseType: "stream",
        });
    }
    async getFileData(fileId) {
        return this.drive.files
            .get({
            fileId,
            fields: "webViewLink, webContentLink, thumbnailLink",
        })
            .then((rsp) => {
            const { thumbnailLink } = rsp.data;
            const [img] = thumbnailLink !== undefined && thumbnailLink !== null
                ? thumbnailLink.split("=")
                : "";
            return { data: img };
        });
    }
    async shareFile(fileId, email, role, type) {
        const params = {
            fileId,
            requestBody: {
                role,
                type,
                emailAddress: email,
            },
        };
        return this.drive.permissions.create(params);
    }
    generateAuthUrl() {
        return this.auth.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: constants_1.default.GOOGLE_SCOPES,
        });
    }
}
exports.default = GoogleDriveService;
//# sourceMappingURL=googleDrive.js.map