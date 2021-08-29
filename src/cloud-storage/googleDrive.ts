import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as fs from "fs";
import { IClouds } from "./interfaces/clouds";
import constants from "../constants";
import { GaxiosPromise } from "googleapis-common";
import { Readable } from "stream";

class GoogleDriveService implements IClouds {
  auth: OAuth2Client;

  drive: drive_v3.Drive;

  clientId: string;

  clientSecret: string;

  redirectUrl: string;

  refreshToken: string;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUrl: string,
    refreshToken: string
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

    auth.setCredentials({ refresh_token: this.refreshToken });

    const drive = google.drive({ version: "v3", auth });
    return [auth, drive];
  }

  createFolder(
    folderName: string,
    parentId: string
  ): GaxiosPromise<Readable> & GaxiosPromise<drive_v3.Schema$File> & void {
    const test = this.drive.files.create({
      resource: {
        name: folderName,
        mimeType: constants.GOOGLE_FOLDER_PATH,
        parents: [parentId],
      },
      fields: "id, name",
    });

    console.log({ test })
  }

  searchFolder(folderName: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      this.drive.files.list(
        {
          q: `mimeType='${constants.GOOGLE_FOLDER_PATH}' and name='${folderName}'`,
          fields: "files(id, name)",
        },
        (err: Error, res: object) => {
          if (err) {
            return reject(err);
          }
          return resolve(res.data.files ? res.data.files[0] : null);
        }
      );
    });
  }

  saveFile(
    fileName: string,
    filePath: string,
    fileMimeType: string,
    folderId: string
  ): Promise<Response> {
    return this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
    });
  }

  getDriveFiles(folderId: string): Promise<Response> {
    return this.drive.files.list({
      auth: this.auth,
      pageSize: 10,
      q: `'${folderId}' in parents and trashed=false`,
      action: "open",
    });
  }

  getAuthToken(code: string): void {
    this.auth.getToken(code, (err, tokens) => {
      this.auth.setCredentials(tokens);
    });
  }

  async deleteFile(fileId: string): Promise<Response> {
    return this.drive.files.delete({
      fileId,
    });
  }

  downloadFile(fileId: string): Promise<Response> {
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

  async getFileData(fileId: string): Promise<Response> {
    return this.drive.files.get({
      fileId,
      fields: "webViewLink, webContentLink, thumbnailLink",
    });
  }

  async shareFile(
    fileId: string,
    email: string,
    role: string,
    type: string
  ): Promise<Response> {
    return this.drive.permissions.create({
      fileId,
      resource: {
        role,
        type,
        emailAddress: email,
      },
    });
  }

  generateAuthUrl(): Promise<Response> {
    return this.auth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: constants.GOOGLE_SCOPES,
    });
  }
}

export default GoogleDriveService;
