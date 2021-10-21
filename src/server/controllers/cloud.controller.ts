import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { generateAuthUrl, authCallback } from "../services/cloud.service";
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = req.user && req.user._id;
  if (code) {
    const authData = await authCallback(code, userId);
    logger.info({ authData });
    res.redirect(`${constants.REDIRECT_AFTER_CLOUD_AUTH}`);
  } else {
    logger.error("The code does not exist");
  }
});

const cloudController = {
  cloudAuth,
  cloudCallback,
};

export default cloudController;