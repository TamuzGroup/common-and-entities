import qs from "qs";
import { IClouds } from "../../cloud-storage/interfaces/clouds";
import constants from "../../cloud-storage/constants";
import GoogleDriveService from "../../cloud-storage/googleDrive";
import DropboxService from "../../cloud-storage/dropboxService";
import OneDriveService from "../../cloud-storage/oneDriveService";
import config from "../config/config";
import logger from "../utils/logger.util";
import { sendMessage } from "../../kafka/dedicated-producers/cloudStorageTokenMng.producer";

let cloudService: IClouds;

const REDIRECT_URL = "http://localhost:3000/v1/cloud/callback";

export const generateAuthUrl = (
  cloud: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined,
  accessToken: string | string[] | undefined
): string | Promise<string> | boolean => {
  switch (cloud) {
    case constants.CLOUDS.GOOGLE: {
      cloudService = new GoogleDriveService(
        config.googleCloudSettings.clientId,
        config.googleCloudSettings.clientSecret,
        REDIRECT_URL,
        null
      );
      break;
    }
    case constants.CLOUDS.DROPBOX: {
      cloudService = new DropboxService(
        config.dropboxCloudSettings.clientId,
        config.dropboxCloudSettings.clientSecret,
        REDIRECT_URL,
        accessToken
      );
      break;
    }
    case constants.CLOUDS.ONEDRIVE: {
      cloudService = new OneDriveService(
        config.onedriveCloudSettings.clientId,
        config.onedriveCloudSettings.clientSecret,
        REDIRECT_URL,
        null
      );
      break;
    }
    default:
      return true;
  }

  return cloudService.generateAuthUrl();
};

export const authCallback = (
  code: string | string[] | qs.ParsedQs | qs.ParsedQs[],
  userId: string
): Promise<unknown> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      const authData = await cloudService.getAuthToken(code);

      await sendMessage(authData, userId);

      resolve({ refreshToken: authData.refreshToken, cloud: authData.cloud });
    } catch (e) {
      logger.error(e);
    }
  });
};
