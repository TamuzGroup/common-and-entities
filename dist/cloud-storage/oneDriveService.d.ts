import { AxiosBasicCredentials, AxiosResponse } from "axios";
import { IClouds } from "./interfaces/clouds";
declare class OneDriveService implements IClouds {
    auth: AxiosBasicCredentials | undefined;
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    refreshToken: string | null;
    constructor(clientId: string, clientSecret: string, redirectUrl: string, refreshToken: string | null);
    cloudAuth(): null;
    getAuthToken(code: string): Promise<string>;
    createFolder(): Promise<AxiosResponse>;
    deleteFile(fileName: string): Promise<AxiosResponse>;
    downloadFile(): Promise<null>;
    generateAuthUrl(): string;
    getDriveFiles(): Promise<AxiosResponse<never> | {
        data: {
            files: any;
        };
    }>;
    getFileData(fileName: string): Promise<AxiosResponse>;
    saveFile(fileName: string, filePath: string): Promise<AxiosResponse>;
    searchFolder(): Promise<null>;
    shareFile(): Promise<null>;
}
export default OneDriveService;
//# sourceMappingURL=oneDriveService.d.ts.map