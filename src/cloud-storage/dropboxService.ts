import fetch from "node-fetch";
import { Dropbox, DropboxResponse } from "dropbox";
import { files, sharing } from "dropbox/types/dropbox_types";
import { IClouds } from "./interfaces/clouds";

class DropboxService implements IClouds {
  dropbox: Dropbox;

  clientId: string;

  clientSecret: string;

  redirectUrl: string;

  refreshToken: string | null;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUrl: string,
    refreshToken: string | null
  ) {
    this.refreshToken = refreshToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUrl = redirectUrl;
    this.dropbox = this.cloudAuth();
  }

  cloudAuth(): Dropbox {
    return new Dropbox({
      fetch,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
  }

  getAuthToken(code: string): void {
    this.dropbox.auth
      .getAccessTokenFromCode(this.redirectUrl, code)
      .then((token) => {
        this.dropbox.auth.setRefreshToken(token.result.refresh_token);
      });
  }

  generateAuthUrl(): Promise<string> {
    return this.dropbox.auth.getAuthenticationUrl(
      this.redirectUrl,
      null,
      "code",
      "offline",
      null,
      "none",
      false
    );
  }

  createFolder(
    folderName: string
  ): Promise<DropboxResponse<files.CreateFolderResult>> {
    return this.dropbox.filesCreateFolderV2({
      path: `/${folderName}`,
      autorename: false,
    });
  }

  deleteFile(fileId: string): Promise<DropboxResponse<files.DeleteResult>> {
    return this.dropbox.filesDeleteV2({
      path: fileId,
    });
  }

  downloadFile(fileId: string): Promise<DropboxResponse<files.FileMetadata>> {
    return this.dropbox.filesDownload({
      path: fileId,
    });
  }

  getDriveFiles(folderPath: string): Promise<
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
  > {
    return this.dropbox
      .filesListFolder({
        path: folderPath,
      })
      .then((rsp) => {
        return {
          data: { files: rsp.result.entries },
        };
      });
  }

  getFileData(
    fileId: string
  ): Promise<
    DropboxResponse<sharing.ListSharedLinksResult> | { data: { url: string } }
  > {
    return this.dropbox
      .sharingListSharedLinks({
        path: fileId,
      })
      .then((rsp) => {
        return {
          data: { url: rsp.result.links[0].url },
        };
      });
  }

  async saveFile(
    fileName: string
  ): Promise<DropboxResponse<files.FileMetadata>> {
    return this.dropbox.filesUpload({
      path: `/${fileName}`,
      autorename: false,
      mode: { ".tag": "add" },
    });
  }
}

export default DropboxService;
