import qs from "qs";
import { drive_v3 } from "googleapis";
import { DropboxResponse } from "dropbox";
import { files } from "dropbox/types/dropbox_types";
import { ITokenData } from "../../cloud-storage/interfaces/clouds";
export declare const generateAuthUrl: (cloud: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined, cloudToken: any) => Promise<string | Promise<string> | boolean>;
export declare const authCallback: (code: string | string[] | qs.ParsedQs | qs.ParsedQs[], userId: string) => Promise<unknown>;
export declare const getDriveFiles: (folderId: string, isRenderChildren?: string | undefined, cloudToken?: any, cloudType?: string | undefined, userId?: string | undefined) => Promise<{
    tokenData: ITokenData;
    files: any[];
} | {
    files: drive_v3.Schema$File[];
    tokenData: ITokenData;
} | DropboxResponse<files.ListFolderResult> | {
    files: (files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference)[];
}>;
//# sourceMappingURL=cloud.service.d.ts.map