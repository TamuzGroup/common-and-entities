import { GaxiosResponse } from "gaxios";
import { GaxiosPromise } from "googleapis-common";
import { drive_v3 } from "googleapis";
import { Readable } from "stream";

export interface IClouds {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  refreshToken: string;
  cloudAuth(): object;

  createFolder(
    folderName: string,
    parentId: string
  ): GaxiosPromise<drive_v3.Schema$File>;
  searchFolder(folderName: string): Promise<Response>;

  saveFile(
    fileName: string,
    filePath: string,
    fileMimeType: string,
    folderId: string
  ): GaxiosPromise<drive_v3.Schema$File>;

  getDriveFiles(folderId: string): GaxiosPromise<drive_v3.Schema$FileList>;
  getAuthToken: (code: string) => void;

  deleteFile(fileId: string): Promise<GaxiosResponse<void>>;

  downloadFile(fileId: string, fileName: string): GaxiosPromise<Readable>;

  getFileData(fileId: string): Promise<GaxiosResponse<drive_v3.Schema$File>>;

  shareFile(
    fileId: string,
    email: string,
    role: string,
    type: string
  ): Promise<GaxiosResponse<drive_v3.Schema$Permission>>;

  generateAuthUrl(): string;
}
