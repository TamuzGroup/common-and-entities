import { Dropbox, DropboxAuth, DropboxResponse } from "dropbox";
import { files, sharing } from "dropbox/types/dropbox_types";
import qs from "qs";
import { IClouds } from "./interfaces/clouds";
declare class DropboxService implements IClouds {
    dropbox: Dropbox;
    auth: DropboxAuth;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    refreshToken: string | null;
    constructor(clientId: string, clientSecret: string, redirectUrl: string, refreshToken: string | null);
    cloudAuth(): Dropbox;
    getAuthToken(code: string | string[] | qs.ParsedQs | qs.ParsedQs[]): void | Promise<{
        refreshToken: string;
        cloud: string;
    }>;
    generateAuthUrl(): Promise<any>;
    createFolder(folderName: string): Promise<DropboxResponse<files.CreateFolderResult>>;
    deleteFile(fileId: string): Promise<DropboxResponse<files.DeleteResult>>;
    downloadFile(fileId: string): Promise<DropboxResponse<files.FileMetadata>>;
    getDriveFiles(folderId: string): Promise<DropboxResponse<files.ListFolderResult> | {
        files: (files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference)[];
    }>;
    getFileData(fileId: string): Promise<DropboxResponse<sharing.ListSharedLinksResult> | {
        data: string;
    }>;
    saveFile(fileName: string, filePath: string): Promise<DropboxResponse<files.FileMetadata>>;
    searchFolder(): Promise<null>;
}
export default DropboxService;
//# sourceMappingURL=dropboxService.d.ts.map