import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import {
  generateAuthUrl,
  authCallback,
  getDriveFiles,
} from "../services/cloud.service";
import constants from "../../cloud-storage/constants";
import logger from "../utils/logger.util";

const cloudAuth = catchAsync(async (req, res) => {
  const { accessToken } = req.headers;
  const { cloud } = req.query;

  const url = await generateAuthUrl(cloud, accessToken);

  res.status(httpStatus.CREATED).send(url);
});

const cloudCallback = catchAsync(async (req, res) => {
  const { code } = req.query;
  if (code) {
    const accessToken = await authCallback(code);
    logger.info({ accessToken });
    res.redirect(`${constants.REDIRECT_AFTER_CLOUD_AUTH}`);
  } else {
    logger.error("The code does not exist");
  }
});

const getFilesList = catchAsync(async (req, res) => {
  const { folderId, isRenderChildren, cloudType } = req.body;
  const { cloudtoken: cloudToken } = req.headers;
  const files = await getDriveFiles(
    folderId,
    isRenderChildren,
    cloudToken,
    cloudType
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  res.status(httpStatus.CREATED).send(files.data);
});

const cloudController = {
  cloudAuth,
  cloudCallback,
  getFilesList,
};

export default cloudController;
