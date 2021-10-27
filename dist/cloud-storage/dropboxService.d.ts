import { Dropbox, DropboxAuth, DropboxResponse } from "dropbox";
import { files, sharing } from "dropbox/types/dropbox_types";
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
    getAuthToken(code: string): void;
    generateAuthUrl(): Promise<string | object>;
    createFolder(folderName: string): Promise<DropboxResponse<files.CreateFolderResult>>;
    deleteFile(fileId: string): Promise<DropboxResponse<files.DeleteResult>>;
    downloadFile(fileId: string): Promise<DropboxResponse<files.FileMetadata>>;
    getDriveFiles(folderPath: string): Promise<DropboxResponse<files.ListFolderResult> | {
        data: {
            files: (files.FileMetadataReference | files.FolderMetadataReference | files.DeletedMetadataReference)[];
        };
    }>;
    getFileData(fileId: string): Promise<DropboxResponse<sharing.ListSharedLinksResult> | {
        data: {
            url: string;
        };
    }>;
    saveFile(fileName: string): Promise<DropboxResponse<files.FileMetadata>>;
    searchFolder(folderName: string): Promise<null>;
    shareFile(fileId: string, email: string, role: string, type: string): Promise<null>;
}
export default DropboxService;
//# sourceMappingURL=dropboxService.d.ts.map