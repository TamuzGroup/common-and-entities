/// <reference types="node" />
import qs from "qs";
import { AxiosResponse } from "axios";
import { drive_v3 } from "googleapis";
import { DropboxResponse } from "dropbox";
import { files } from "dropbox/types/dropbox_types";
import { GaxiosPromise } from "googleapis-common";
import { ITokenData } from "../../cloud-storage/interfaces/clouds";
export declare const generateAuthUrl: (cloud: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined, cloudToken: any) => Promise<string | Promise<string> | boolean>;
export declare const authCallback: (code: string | string[] | qs.ParsedQs | qs.ParsedQs[], userId: string, userName: string) => Promise<unknown>;
export declare const getDriveFiles: (folderId: string, isRenderChildren?: string | undefined, cloudToken?: any, cloudType?: string | undefined, userId?: string | undefined) => Promise<{
    tokenData: ITokenData;
    files: any[];
} | {
    files: drive_v3.Schema$File[];
    tokenData: ITokenData;
} | DropboxResponse<files.ListFolderResult> | {
    files: (files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference)[];
}>;
export declare const saveFile: (originalName: string, path: string, mimetype: string, parentId: any, cloudToken?: any, cloudType?: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined, userId?: any) => Promise<GaxiosPromise<drive_v3.Schema$File> | Promise<AxiosResponse> | Promise<DropboxResponse<files.FileMetadata>>>;
export declare const deleteFileById: (fileId: string, fileName: string, cloudToken?: any, cloudType?: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined, userId?: any) => Promise<AxiosResponse<any> | import("googleapis-common").GaxiosResponse<void> | DropboxResponse<files.DeleteResult>>;
export declare const downloadFileById: (fileId: string, fileName: string, cloudToken?: any, cloudType?: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined, userId?: any) => Promise<DropboxResponse<files.FileMetadata> | import("googleapis-common").GaxiosResponse<import("stream").Readable> | null>;
//# sourceMappingURL=cloud.service.d.ts.map