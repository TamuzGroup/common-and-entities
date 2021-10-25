import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as fs from "fs";
import { GaxiosPromise } from "googleapis-common";
import { GaxiosResponse } from "gaxios";
import { Readable } from "stream";
import qs from "qs";
import { IClouds, ITokenData } from "./interfaces/clouds";
import constants from "./constants";

class GoogleDriveService implements IClouds {
  auth: OAuth2Client;

  drive: drive_v3.Drive;

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
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUrl = redirectUrl;
    this.refreshToken = refreshToken;

    const [auth, drive] = this.cloudAuth();
    this.auth = auth;
    this.drive = drive;
  }

  cloudAuth(): [OAuth2Client, drive_v3.Drive] {
    const auth = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUrl
    );

    if (this.refreshToken)
      auth.setCredentials({ refresh_token: this.refreshToken });

    const drive = google.drive({ version: "v3", auth });
    return [auth, drive];
  }

  createFolder(
    folderName: string,
    parentId: string
  ): GaxiosPromise<drive_v3.Schema$File> {
    const params: drive_v3.Params$Resource$Files$Create | undefined = {
      requestBody: {
        name: folderName,
        mimeType: constants.GOOGLE_FOLDER_PATH,
        ...(parentId && { parents: [parentId] }),
      },
      fields: "id, name",
    };
    return this.drive.files.create(params);
  }

  searchFolder(folderName: string): Promise<drive_v3.Schema$File | null> {
    return new Promise((resolve, reject) => {
      return this.drive.files.list(
        {
          q: `mimeType='${constants.GOOGLE_FOLDER_PATH}' and name='${folderName}'`,
          fields: "files(id, name)",
        },
        (
          err: Error | null,
          res?: GaxiosResponse<drive_v3.Schema$FileList> | null
        ): void => {
          if (err) {
            return reject(err);
          }
          if (res) {
            const restData = res.data.files ? res.data.files[0] : null;
            return resolve(restData);
          }
        }
      );
    });
  }

  saveFile(
    fileName: string,
    filePath: string,
    fileMimeType: string,
    folderId: string
  ): GaxiosPromise<drive_v3.Schema$File> {
    const params: drive_v3.Params$Resource$Files$Create | undefined = {
      requestBody: {
        name: fileName,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    };
    return this.drive.files.create(params);
  }

  getChildren(folderId: string): Promise<{ data: drive_v3.Schema$File[] }> {
    const params: drive_v3.Params$Resource$Files$List | undefined = {
      auth: this.auth,
      pageSize: 1000,
      spaces: "appDataFolder",
      ...(folderId && { q: `'${folderId}' in parents and trashed=false` }),
      fields: "files(id, name, parents, mimeType)",
    };

    return this.drive.files.list(params).then((rsp) => {
      const { files } = rsp.data;
      const filesData = files !== null && files !== undefined ? files : [];
      const filteredFiles = filesData.map((item) => {
        return {
          ...item,
          ".tag":
            item.mimeType === constants.GOOGLE_FOLDER_PATH ? "folder" : "file",
        };
      });
      return {
        data: filteredFiles,
      };
    });
  }

  getDriveFiles(
    folderIdOrName?: string,
    isRenderChildren?: string
  ): Promise<
    | {
        tokenData: { cloudType: string; refreshToken: string | null };
        files: any[];
      }
    | { files: drive_v3.Schema$File[]; tokenData: ITokenData }
  > {
    const params: drive_v3.Params$Resource$Files$List | undefined = {
      auth: this.auth,
      pageSize: 1000,
      spaces: "appDataFolder",
      ...(folderIdOrName && {
        q: `'${folderIdOrName}' in parents and trashed=false`,
      }),
      fields: "files(id, name, parents, mimeType)",
    };

    const isRenderChildrenItems = isRenderChildren === "true";

    return this.drive.files.list(params).then((rsp) => {
      const { files } = rsp.data;
      const filesData = files !== null && files !== undefined ? files : [];

      let filteredFiles: any[] = [];

      if (!isRenderChildrenItems) {
        filteredFiles = filesData.filter(
          (item) => item.parents && item.parents[0] === folderIdOrName
        );
      }

      filteredFiles = filteredFiles.map((item) => {
        return {
          ...item,
          ".tag":
            item.mimeType === constants.GOOGLE_FOLDER_PATH ? "folder" : "file",
        };
      });
      return {
        files: filteredFiles,
        tokenData: {
          refreshToken: this.refreshToken,
          cloudType: constants.CLOUDS.DROPBOX,
        },
      };
    });
  }

  getAuthToken(
    code: string | string[] | qs.ParsedQs | qs.ParsedQs[] | any
  ): void | Promise<{ refreshToken: string; cloud: string }> {
    return new Promise((resolve) => {
      return this.auth.getToken(code, (err, tokens) => {
        if (tokens && tokens.refresh_token) {
          this.auth.setCredentials(tokens);

          const authData = {
            refreshToken: tokens.refresh_token,
            cloud: constants.CLOUDS.GOOGLE,
          };

          return resolve(authData);
        }
      });
    });
  }

  async deleteFile(fileId: string): Promise<GaxiosResponse<void>> {
    const params: drive_v3.Params$Resource$Files$Delete | undefined = {
      fileId,
    };
    return this.drive.files.delete(params);
  }

  downloadFile(fileId: string): GaxiosPromise<Readable> {
    return this.drive.files.get(
      {
        fileId,
        alt: "media",
      },
      {
        responseType: "stream",
      }
    );
  }

  async getFileData(
    fileId: string
  ): Promise<GaxiosResponse<drive_v3.Schema$File> | { data: string }> {
    return this.drive.files
      .get({
        fileId,
        fields: "webViewLink, webContentLink, thumbnailLink",
      })
      .then((rsp) => {
        const { thumbnailLink } = rsp.data;
        const [img]: any =
          thumbnailLink !== undefined && thumbnailLink !== null
            ? thumbnailLink.split("=")
            : "";
        return { data: img };
      });
  }

  async shareFile(
    fileId: string,
    email: string,
    role: string,
    type: string
  ): Promise<GaxiosResponse<drive_v3.Schema$Permission>> {
    const params: drive_v3.Params$Resource$Permissions$Create | undefined = {
      fileId,
      requestBody: {
        role,
        type,
        emailAddress: email,
      },
    };
    return this.drive.permissions.create(params);
  }

  generateAuthUrl(): string {
    return this.auth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: constants.GOOGLE_SCOPES,
    });
  }
}

export default GoogleDriveService;
