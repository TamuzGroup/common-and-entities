import fetch from "node-fetch";
import { Dropbox, DropboxAuth, DropboxResponse } from "dropbox";
import { files, sharing } from "dropbox/types/dropbox_types";
import qs from "qs";
import { IClouds } from "./interfaces/clouds";

class DropboxService implements IClouds {
  dropbox: Dropbox;

  auth: DropboxAuth;

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
    this.auth = new DropboxAuth({
      fetch,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    this.dropbox = this.cloudAuth();
  }

  cloudAuth(): Dropbox {
    if (this.refreshToken != null) {
      this.auth.setRefreshToken(this.refreshToken);
    }
    return new Dropbox({
      auth: this.auth,
    });
  }

  getAuthToken(
    code: string | string[] | qs.ParsedQs | qs.ParsedQs[]
  ): void | Promise<{ refreshToken: string; cloud: string }> {
    return new Promise((resolve) => {
      if (typeof code === "string") {
        this.auth
          .getAccessTokenFromCode(this.redirectUrl, code)
          .then((token: DropboxResponse<any>) => {
            const { refresh_token: refreshToken } = token.result;
            if (refreshToken != null) {
              this.auth.setRefreshToken(refreshToken);

              const authData = {
                refreshToken,
                cloud: "dropbox",
              };

              return resolve(authData);
            }
          });
      }
    });
  }

  generateAuthUrl(): Promise<any> {
    return this.auth.getAuthenticationUrl(
      this.redirectUrl,
      "",
      "code",
      "offline",
      [],
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

  getDriveFiles(folderId: string): Promise<
    | DropboxResponse<files.ListFolderResult>
    | {
        data: (
          | files.FileMetadataReference
          | files.FolderMetadataReference
          | files.DeletedMetadataReference
        )[];
      }
  > {
    return this.dropbox
      .filesListFolder({
        path: folderId || "",
        include_mounted_folders: true,
      })
      .then((rsp) => {
        return {
          data: rsp.result.entries,
        };
      });
  }

  getFileData(
    fileId: string
  ): Promise<
    DropboxResponse<sharing.ListSharedLinksResult> | { data: string }
  > {
    return this.dropbox
      .sharingListSharedLinks({
        path: fileId,
      })
      .then((rsp) => {
        const url = rsp.result.links[0].url.split("?");
        return {
          data: `${url}?raw=1`,
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

  // eslint-disable-next-line class-methods-use-this
  searchFolder(): Promise<null> {
    return Promise.resolve(null);
  }
}

export default DropboxService;
