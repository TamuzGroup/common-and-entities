import { IClouds } from "../../cloud-storage/interfaces/clouds";
import constants from "../../cloud-storage/constants";
import GoogleDriveService from "../../cloud-storage/googleDrive";
import DropboxService from "../../cloud-storage/dropboxService";
import OneDriveService from "../../cloud-storage/oneDriveService";
import config from "../config/config";

let cloudService: IClouds;

const REDIRECT_URL = "http://localhost:5000/api/clouds/callback";

export const generateAuthUrl = (
  cloud: any,
  accessToken: any
): string | Promise<string> | boolean => {
  switch (cloud) {
    case constants.CLOUDS.GOOGLE: {
      cloudService = new GoogleDriveService(
        config.googleCloudSettings.clientId,
        config.googleCloudSettings.clientSecret,
        REDIRECT_URL,
        ""
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
