import qs from "qs";
import { AxiosBasicCredentials, AxiosResponse } from "axios";
import { IClouds } from "./interfaces/clouds";
declare class OneDriveService implements IClouds {
    auth: AxiosBasicCredentials | null;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    refreshToken: string | null;
    constructor(clientId: string, clientSecret: string, redirectUrl: string, refreshToken: string | null);
    cloudAuth(): null;
    getAuthToken(code: string | string[] | qs.ParsedQs | qs.ParsedQs[]): void | Promise<{
        refreshToken: string;
        cloud: string;
    }>;
    createFolder(): Promise<AxiosResponse>;
    deleteFile(fileName: string): Promise<AxiosResponse>;
    downloadFile(): Promise<null>;
    generateAuthUrl(): string;
    getDriveFiles(folderIdOrName?: string, isRenderChildren?: string): Promise<{
        tokenData: {
            cloudType: string;
            refreshToken: string | null;
        };
        files: any[];
    }>;
    getFileData(fileName: string): Promise<AxiosResponse>;
    saveFile(fileName: string, filePath: string): Promise<AxiosResponse>;
    searchFolder(): Promise<null>;
    shareFile(): Promise<null>;
}
export default OneDriveService;
//# sourceMappingURL=oneDriveService.d.ts.map