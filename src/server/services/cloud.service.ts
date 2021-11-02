import qs from "qs";
import axios, { AxiosResponse } from "axios";
import { drive_v3 } from "googleapis";
import { DropboxResponse } from "dropbox";
import { files } from "dropbox/types/dropbox_types";
import { GaxiosPromise } from "googleapis-common";
import fs from "fs";
import { IClouds, ITokenData } from "../../cloud-storage/interfaces/clouds";
import constants from "../../cloud-storage/constants";
import GoogleDriveService from "../../cloud-storage/googleDrive";
import DropboxService from "../../cloud-storage/dropboxService";
import OneDriveService from "../../cloud-storage/oneDriveService";
import config from "../config/config";
import logger from "../utils/logger.util";
import { sendMessage } from "../../kafka/dedicated-producers/cloudStorageTokenMng.producer";
import helper from "../utils/helper.util";

let cloudService: IClouds;

const REDIRECT_URL = "http://localhost:3000/v1/cloud/callback";

const getCloudToken = (userId: string | undefined): Promise<AxiosResponse> => {
  return axios.post("http://localhost:3001/v1/token/get-token", {
    userId,
  });
};

const getCloudService = (
  cloudType: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  refreshToken: string
) => {
  switch (cloudType) {
    case constants.CLOUDS.GOOGLE: {
      cloudService = new GoogleDriveService(
        config.googleCloudSettings.clientId,
        config.googleCloudSettings.clientSecret,
        REDIRECT_URL,
        refreshToken
      );
      break;
    }
    case constants.CLOUDS.DROPBOX: {
      cloudService = new DropboxService(
        config.dropboxCloudSettings.clientId,
        config.dropboxCloudSettings.clientSecret,
        REDIRECT_URL,
        refreshToken
      );
      break;
    }
    case constants.CLOUDS.ONEDRIVE: {
      cloudService = new OneDriveService(
        config.onedriveCloudSettings.clientId,
        config.onedriveCloudSettings.clientSecret,
        REDIRECT_URL,
        refreshToken
      );
      break;
    }
    default:
      return true;
  }
};

// This function connects to the cloud service through two parameters that come from the client.
// The parameters are saved in sessionStorage in client after user does auth.
// If no parameters are reached, we will call the safe box service to obtain the token data of the same user
const connectToServiceByCloud = (
  cloud: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  refresh_token: any,
  userId?: string
): Promise<boolean> => {
  let refreshToken = refresh_token;
  let cloudType = cloud;

  return new Promise((resolve) => {
    if (!refresh_token) {
      getCloudToken(userId)
        .then((rsp) => {
          const { cloud_type: userCloud } = rsp.data;
          const [token] = rsp.data.tokens;
          refreshToken = token;
          cloudType = userCloud;
          getCloudService(cloudType, refreshToken);
          resolve(true);
        })
        .catch((err) => {
          logger.error(`get token: ${err}`);
        });
    } else {
      getCloudService(cloudType, refreshToken);
      resolve(true);
    }
  });
};

export const generateAuthUrl = async (
  cloud: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  cloudToken: any
): Promise<string | Promise<string> | boolean> => {
  getCloudService(cloud, cloudToken);
  return cloudService.generateAuthUrl();
};

export const authCallback = (
  code: string | string[] | qs.ParsedQs | qs.ParsedQs[],
  userId: string,
  userName: string
): Promise<unknown> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const authData = await cloudService.getAuthToken(code);
      await sendMessage(authData, userId);

      const pdfText = `welcome ${userName}`;
      const fileName = "welcome.pdf";

      helper.createPdf(pdfText, fileName);

      await cloudService.saveFile(fileName);

      fs.unlinkSync(fileName);

      resolve({ refreshToken: authData.refreshToken, cloud: authData.cloud });
    } catch (err) {
      logger.error(`cloud callback: ${err}`);
    }
  });
};

export const getDriveFiles = async (
  folderId: string,
  isRenderChildren?: string,
  cloudToken?: any,
  cloudType?: string,
  userId?: string
): Promise<
  | {
      tokenData: ITokenData;
      files: any[];
    }
  | { files: drive_v3.Schema$File[]; tokenData: ITokenData }
  | DropboxResponse<files.ListFolderResult>
  | {
      files: (
        | files.FileMetadataReference
        | files.FolderMetadataReference
        | files.DeletedMetadataReference
      )[];
    }
> => {
  await connectToServiceByCloud(cloudType, cloudToken, userId);
  return cloudService.getDriveFiles(folderId, isRenderChildren);
};

export const saveFile = async (
  originalName: string,
  path: string,
  mimetype: string,
  parentId: any,
  cloudToken?: any,
  cloudType?: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  userId?: any
): Promise<
  | GaxiosPromise<drive_v3.Schema$File>
  | Promise<AxiosResponse>
  | Promise<DropboxResponse<files.FileMetadata>>
> => {
  await connectToServiceByCloud(cloudType, cloudToken, userId);
  return cloudService.saveFile(originalName, path, mimetype, parentId);
};

export const deleteFileById = async (
  fileId: string,
  fileName: string,
  cloudToken?: any,
  cloudType?: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  userId?: any
) => {
  await connectToServiceByCloud(cloudType, cloudToken, userId);
  return cloudService.deleteFile(fileId, fileName);
};

export const downloadFileById = async (
  fileId: string,
  fileName: string,
  cloudToken?: any,
  cloudType?: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  userId?: any
) => {
  await connectToServiceByCloud(cloudType, cloudToken, userId);
  return cloudService.downloadFile(fileId, fileName);
};
