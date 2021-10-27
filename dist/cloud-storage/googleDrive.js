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
        auth.setCredentials({ refresh_token: this.refreshToken });
        const drive = googleapis_1.google.drive({ version: "v3", auth });
        return [auth, drive];
    }
    createFolder(folderName, parentId) {
        const params = {
            requestBody: {
                name: folderName,
                mimeType: constants_1.default.GOOGLE_FOLDER_PATH,
                parents: [parentId],
            },
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
                mimeType: fileMimeType,
                parents: folderId ? [folderId] : [],
            },
            media: {
                mimeType: fileMimeType,
                body: fs.createReadStream(filePath),
            },
        };
        return this.drive.files.create(params);
    }
    getDriveFiles(folderId) {
        const params = {
            auth: this.auth,
            pageSize: 10,
            q: `'${folderId}' in parents and trashed=false`,
        };
        return this.drive.files.list(params);
    }
    getAuthToken(code) {
        this.auth.getToken(code, (err, tokens) => {
            if (tokens) {
                this.auth.setCredentials(tokens);
            }
        });
    }
    deleteFile(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                fileId,
            };
            return this.drive.files.delete(params);
        });
    }
    downloadFile(fileId) {
        return this.drive.files.get({
            fileId,
            alt: "media",
        }, {
            responseType: "stream",
        });
    }
    getFileData(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.drive.files.get({
                fileId,
                fields: "webViewLink, webContentLink, thumbnailLink",
            });
        });
    }
    shareFile(fileId, email, role, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                fileId,
                requestBody: {
                    role,
                    type,
                    emailAddress: email,
                },
            };
            return this.drive.permissions.create(params);
        });
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