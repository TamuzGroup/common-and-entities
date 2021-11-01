/// <reference types="node" />
import { GaxiosResponse } from "gaxios";
import { GaxiosPromise } from "googleapis-common";
import { drive_v3 } from "googleapis";
import { Readable } from "stream";
import { OAuth2Client } from "google-auth-library";
import { Dropbox, DropboxResponse } from "dropbox";
import { files, sharing } from "dropbox/types/dropbox_types";
import { AxiosResponse } from "axios";
import qs from "qs";
export interface IClouds {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    refreshToken: string | null;
    cloudAuth(): [OAuth2Client, drive_v3.Drive] | Dropbox | null;
    createFolder(folderName: string, parentId: string): GaxiosPromise<drive_v3.Schema$File> | Promise<AxiosResponse> | Promise<DropboxResponse<files.CreateFolderResult>>;
    searchFolder(folderName?: string): Promise<drive_v3.Schema$File | null>;
    saveFile(fileName: string, filePath: string, fileMimeType: string, folderId: string): GaxiosPromise<drive_v3.Schema$File> | Promise<AxiosResponse> | Promise<DropboxResponse<files.FileMetadata>>;
    getDriveFiles(folderIdOrName?: string, isRenderChildren?: string): Promise<{
        tokenData: ITokenData;
        files: any[];
    } | {
        files: drive_v3.Schema$File[];
        tokenData: ITokenData;
    } | DropboxResponse<files.ListFolderResult> | {
        files: (files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference)[];
    }>;
    getAuthToken(code: string | string[] | qs.ParsedQs | qs.ParsedQs[]): void | Promise<any>;
    deleteFile(fileId?: string, fileName?: string): Promise<GaxiosResponse<void>> | Promise<AxiosResponse> | Promise<DropboxResponse<files.DeleteResult>>;
    downloadFile(fileId?: string, fileName?: string): GaxiosPromise<Readable> | Promise<DropboxResponse<files.FileMetadata> | null>;
    getFileData(fileId?: string, fileName?: string): Promise<GaxiosResponse<drive_v3.Schema$File> | {
        data: string;
    }> | Promise<DropboxResponse<sharing.ListSharedLinksResult> | {
        data: string;
    }>;
    shareFile?(fileId?: string, email?: string, role?: string, type?: string): Promise<GaxiosResponse<drive_v3.Schema$Permission>> | Promise<DropboxResponse<Array<sharing.FileMemberActionResult>>> | Promise<void | DropboxResponse<sharing.FileMemberActionResult[]>> | Promise<null>;
    generateAuthUrl(): string | Promise<string> | boolean;
}
export interface IOneDriveTreeItem {
    ".tag": string;
    cTag: string;
    children?: IOneDriveTreeItem[];
    createdBy: {
        application: {
            displayName: string;
            id: string;
        };
        user: {
            displayName: string;
            id: string;
        };
    };
    createdDateTime: string;
    eTag: string;
    fileSystemInfo: {
        createdDateTime: string;
        lastModifiedDateTime: string;
    };
    folder: {
        childCount: number;
        view: {
            sortBy: string;
            sortOrder: string;
            viewType: string;
        };
    };
    id: string;
    lastModifiedBy: {
        application: {
            displayName: string;
            id: string;
        };
        user: {
            displayName: string;
            id: string;
        };
    };
    lastModifiedDateTime: string;
    name: string;
    parentReference: {
        driveId: string;
        driveType: string;
        id: string;
        name: string;
        path: string;
    };
    reactions: {
        commentCount: number;
    };
    size: number;
    webUrl: string;
}
export interface IDropboxTreeItem {
    ".tag": string;
    client_modified: string;
    content_hash: string;
    id: string;
    is_downloadable: boolean;
    name: string;
    path_display: string;
    path_lower: string;
    rev: string;
    server_modified: string;
    size: number;
    children?: IDropboxTreeItem[];
}
export interface ITokenData {
    refreshToken: string | null;
    cloudType: string;
}
//# sourceMappingURL=clouds.d.ts.map