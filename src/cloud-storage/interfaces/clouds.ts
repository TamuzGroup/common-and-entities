import { GaxiosResponse } from "gaxios";
import { GaxiosPromise } from "googleapis-common";
import { drive_v3 } from "googleapis";
import { Readable } from "stream";
import { OAuth2Client } from "google-auth-library";
import { Dropbox, DropboxResponse } from "dropbox";
import { files, sharing } from "dropbox/types/dropbox_types";

export interface IClouds {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  refreshToken: string | null;
  cloudAuth(): [OAuth2Client, drive_v3.Drive] | Dropbox;

  createFolder(
    folderName: string,
    parentId: string
  ):
    | GaxiosPromise<drive_v3.Schema$File>
    | Promise<DropboxResponse<files.CreateFolderResult>>;
  searchFolder(folderName: string): Promise<drive_v3.Schema$File | null>;

  saveFile(
    fileName: string,
    filePath: string,
    fileMimeType: string,
    folderId: string
  ):
    | GaxiosPromise<drive_v3.Schema$File>
    | Promise<DropboxResponse<files.FileMetadata>>;

  getDriveFiles(
    folderId: string,
    folderPath: string
  ):
    | GaxiosPromise<drive_v3.Schema$FileList>
    | Promise<
        | DropboxResponse<files.ListFolderResult>
        | {
            data: {
              files: (
                | files.FileMetadataReference
                | files.FolderMetadataReference
                | files.DeletedMetadataReference
              )[];
            };
          }
      >;
  getAuthToken: (code: string) => void;

  deleteFile(
    fileId: string
  ):
    | Promise<GaxiosResponse<void>>
    | Promise<DropboxResponse<files.DeleteResult>>;

  downloadFile(
    fileId: string,
    fileName: string
  ): GaxiosPromise<Readable> | Promise<DropboxResponse<files.FileMetadata>>;

  getFileData(
    fileId: string
  ):
    | Promise<GaxiosResponse<drive_v3.Schema$File>>
    | Promise<
        | DropboxResponse<sharing.ListSharedLinksResult>
        | { data: { url: string } }
      >;

  shareFile(
    fileId: string,
    email: string,
    role: string,
    type: string
  ):
    | Promise<GaxiosResponse<drive_v3.Schema$Permission>>
    | Promise<DropboxResponse<Array<sharing.FileMemberActionResult>>>
    | Promise<void | DropboxResponse<sharing.FileMemberActionResult[]>>;

  generateAuthUrl(): string | Promise<string>;
}
