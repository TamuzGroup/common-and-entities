import fs from "fs";
import qs from "qs";
import { AxiosBasicCredentials, AxiosResponse } from "axios";
import { IClouds, IOneDriveTreeItem } from "./interfaces/clouds";
import { axiosRequest } from "./utils/auth.util";
import constants from "./constants";

const BASE_URL = "https://graph.microsoft.com/v1.0/drive/";

class OneDriveService implements IClouds {
  auth: AxiosBasicCredentials | null;

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
    this.redirectUrl = redirectUrl;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.auth = null;
  }

  // eslint-disable-next-line class-methods-use-this
  cloudAuth(): null {
    return null;
  }

  getAuthToken(
    code: string | string[] | qs.ParsedQs | qs.ParsedQs[]
  ): void | Promise<{ refreshToken: string; cloud: string }> {
    return new Promise((resolve) => {
      const options = {
        body: qs.stringify({
          client_id: this.clientId,
          redirect_uri: this.redirectUrl,
          client_secret: this.clientSecret,
          code,
          grant_type: "authorization_code",
        }),
        headers: [["Content-Type", "application/x-www-form-urlencoded"]],
      };

      axiosRequest(constants.ONE_DRIVE_GET_TOKEN_URL, options).then(
        (data: any) => {
          this.auth = data.refresh_token;

          const authData = {
            refreshToken: data.refresh_token,
            cloud: "onedrive",
          };

          resolve(authData);
        }
      );
    });
  }

  createFolder(): Promise<AxiosResponse> {
    const options = {
      auth: this.auth,
    };
    return axiosRequest(`${BASE_URL}special/approot/children`, options);
  }

  deleteFile(fileName: string): Promise<AxiosResponse> {
    const options = {
      auth: this.auth,
      method: "DELETE",
    };
    return axiosRequest(`${BASE_URL}special/approot:/${fileName}`, options);
  }

  // eslint-disable-next-line class-methods-use-this
  downloadFile(): Promise<null> {
    return Promise.resolve(null);
  }

  generateAuthUrl(): string {
    return `${constants.ONE_DRIVE_AUTHORIZE_URL}?client_id=${this.clientId}&scope=Files.ReadWrite.AppFolder&response_type=code&redirect_uri=${this.redirectUrl}`;
  }

  getDriveFiles(
    folderIdOrName: string,
    isRenderChildren: string
  ): Promise<
    { data: { files: unknown[] } } | { data: { files: IOneDriveTreeItem[] } }
  > {
    const options = {
      auth: this.auth,
    };

    const isRenderChildrenItems = isRenderChildren === "true";

    const url = isRenderChildrenItems
      ? `${BASE_URL}special/approot:/${folderIdOrName}:/children`
      : `${BASE_URL}special/approot/children`;

    return axiosRequest(url, options).then((rsp: any) => {
      const treeData = rsp.value.map((item: IOneDriveTreeItem) => {
        return {
          ...item,
          ".tag": item.folder ? "folder" : "file",
        };
      });

      return { data: treeData };
    });
  }

  getFileData(fileName: string): Promise<AxiosResponse> {
    const options = {
      auth: this.auth,
    };

    return axiosRequest(
      `${BASE_URL}special/approot:/${fileName}:/thumbnails`,
      options
    ).then((data) => {
      return data.data;
    });
  }

  saveFile(fileName: string, filePath: string): Promise<AxiosResponse> {
    const options = {
      method: "PUT",
      body: fs.createReadStream(filePath),
      auth: this.auth,
    };
    return axiosRequest(
      `${BASE_URL}special/approot:/${fileName}:/content`,
      options
    );
  }

  // eslint-disable-next-line class-methods-use-this
  searchFolder(): Promise<null> {
    return Promise.resolve(null);
  }

  // eslint-disable-next-line class-methods-use-this
  shareFile(): Promise<null> {
    return Promise.resolve(null);
  }
}

export default OneDriveService;
