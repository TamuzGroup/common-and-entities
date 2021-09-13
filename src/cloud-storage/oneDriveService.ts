import fs from "fs";
import * as qs from "qs";
import { AxiosBasicCredentials, AxiosResponse } from "axios";
import { IClouds, IOneDriveTreeItem } from "./interfaces/clouds";
import { axiosRequest } from "./utils/auth.util";

const BASE_URL = "https://graph.microsoft.com/v1.0/drive/";

class OneDriveService implements IClouds {
  auth: AxiosBasicCredentials | undefined;

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
    this.auth = undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  cloudAuth(): null {
    return null;
  }

  getAuthToken(code: string): Promise<string> {
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
      return axiosRequest(
        "https://login.live.com/oauth20_token.srf",
        options
      ).then((data) => {
        this.auth = data.data.access_token;
        resolve(data.data.access_token);
      });
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
    return `https://login.live.com/oauth20_authorize.srf?client_id=${this.clientId}&scope=Files.ReadWrite.AppFolder&response_type=code&redirect_uri=${this.redirectUrl}`;
  }

  getChildren(
    name: string
  ): IOneDriveTreeItem[] | PromiseLike<IOneDriveTreeItem[]> {
    const options = {
      authToken: this.auth,
    };
    return axiosRequest(
      `${BASE_URL}special/approot:/${name}:/children`,
      options
    ).then((data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return data.value;
    });
  }

  getDriveFiles(): Promise<
    { data: { files: unknown[] } } | { data: { files: IOneDriveTreeItem[] } }
  > {
    const options = {
      auth: this.auth,
    };

    return axiosRequest(`${BASE_URL}special/approot/children`, options).then(
      async (rsp) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const treeData = rsp.value.map((item: IOneDriveTreeItem) => {
          return {
            ...item,
            ".tag": item.folder ? "folder" : "file",
            children:
              item.folder &&
              item.folder.childCount > 0 &&
              this.getChildren(item.name),
          };
        });

        const data = await Promise.all(
          treeData.map(async (item: IOneDriveTreeItem) => {
            return {
              ...item,
              children: await item.children,
            };
          })
        );
        return { data: { files: data } };
      }
    );
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
