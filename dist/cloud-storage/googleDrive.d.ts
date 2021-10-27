/// <reference types="node" />
import { drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { GaxiosPromise } from "googleapis-common";
import { GaxiosResponse } from "gaxios";
import { Readable } from "stream";
import { IClouds } from "./interfaces/clouds";
declare class GoogleDriveService implements IClouds {
    auth: OAuth2Client;
    drive: drive_v3.Drive;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    refreshToken: string;
    constructor(clientId: string, clientSecret: string, redirectUrl: string, refreshToken: string);
    cloudAuth(): [OAuth2Client, drive_v3.Drive];
    createFolder(folderName: string, parentId: string): GaxiosPromise<drive_v3.Schema$File>;
    searchFolder(folderName: string): Promise<drive_v3.Schema$File | null>;
    saveFile(fileName: string, filePath: string, fileMimeType: string, folderId: string): GaxiosPromise<drive_v3.Schema$File>;
    getDriveFiles(folderId: string): GaxiosPromise<drive_v3.Schema$FileList>;
    getAuthToken(code: string): void;
    deleteFile(fileId: string): Promise<GaxiosResponse<void>>;
    downloadFile(fileId: string): GaxiosPromise<Readable>;
    getFileData(fileId: string): Promise<GaxiosResponse<drive_v3.Schema$File>>;
    shareFile(fileId: string, email: string, role: string, type: string): Promise<GaxiosResponse<drive_v3.Schema$Permission>>;
    generateAuthUrl(): string;
}
export default GoogleDriveService;
//# sourceMappingURL=googleDrive.d.ts.map