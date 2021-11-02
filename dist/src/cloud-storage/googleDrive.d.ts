/// <reference types="node" />
import { drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { GaxiosPromise } from "googleapis-common";
import { GaxiosResponse } from "gaxios";
import { Readable } from "stream";
import qs from "qs";
import { IClouds, ITokenData } from "./interfaces/clouds";
declare class GoogleDriveService implements IClouds {
    auth: OAuth2Client;
    drive: drive_v3.Drive;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    refreshToken: string | null;
    constructor(clientId: string, clientSecret: string, redirectUrl: string, refreshToken: string | null);
    cloudAuth(): [OAuth2Client, drive_v3.Drive];
    createFolder(folderName: string, parentId: string): GaxiosPromise<drive_v3.Schema$File>;
    searchFolder(folderName: string): Promise<drive_v3.Schema$File | null>;
    saveFile(fileName: string, filePath: string, fileMimeType: string, folderId: string): GaxiosPromise<drive_v3.Schema$File>;
    getChildren(folderId: string): Promise<{
        data: drive_v3.Schema$File[];
    }>;
    getDriveFiles(folderIdOrName?: string, isRenderChildren?: string): Promise<{
        tokenData: {
            cloudType: string;
            refreshToken: string | null;
        };
        files: any[];
    } | {
        files: drive_v3.Schema$File[];
        tokenData: ITokenData;
    }>;
    getAuthToken(code: string | string[] | qs.ParsedQs | qs.ParsedQs[] | any): void | Promise<{
        refreshToken: string;
        cloud: string;
    }>;
    deleteFile(fileId: string): Promise<GaxiosResponse<void>>;
    downloadFile(fileId: string): GaxiosPromise<Readable>;
    getFileData(fileId: string): Promise<GaxiosResponse<drive_v3.Schema$File> | {
        data: string;
    }>;
    shareFile(fileId: string, email: string, role: string, type: string): Promise<GaxiosResponse<drive_v3.Schema$Permission>>;
    generateAuthUrl(): string;
}
export default GoogleDriveService;
//# sourceMappingURL=googleDrive.d.ts.map