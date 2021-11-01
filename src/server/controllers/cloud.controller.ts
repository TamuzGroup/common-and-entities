import httpStatus from "http-status";
import multer from "multer";
import fs from "fs";
import catchAsync from "../utils/catchAsync";
import {
  generateAuthUrl,
  authCallback,
  getDriveFiles,
  saveFile,
  deleteFileById,
  downloadFileById,
} from "../services/cloud.service";
import constants from "../../cloud-storage/constants";
import logger from "../utils/logger.util";

const upload = multer({
  dest: "./",
}).single("file");

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userName = req.user && req.user.name;
  if (code) {
    const authData = await authCallback(code, userId, userName);
    logger.info({ authData });
    res.redirect(`${constants.REDIRECT_AFTER_CLOUD_AUTH}`);
  } else {
    logger.error("The code does not exist");
  }
});

const getFilesList = catchAsync(async (req, res) => {
  const { folderId, isRenderChildren, cloudType, userId } = req.body;
  const { cloudtoken: cloudToken } = req.headers;

  const files = await getDriveFiles(
    folderId,
    isRenderChildren,
    cloudToken,
    cloudType,
    userId
  );

  res.status(httpStatus.CREATED).send(files);
});

const uploadFile = catchAsync(async (req, res) => {
  upload(req, res, async (err) => {
    const { parentId, cloudType, userId } = req.query;
    const { cloudtoken: cloudToken } = req.headers;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { originalname: originalName, path, mimetype } = req.file;
    if (err) {
      logger.error(`upload file: ${err}`);
    }

    const data = await saveFile(
      originalName,
      path,
      mimetype,
      parentId,
      cloudToken,
      cloudType,
      userId
    );

    fs.unlinkSync(path);

    res.status(httpStatus.CREATED).send(data);
  });
});

const deleteFile = catchAsync(async (req, res) => {
  const { fileId, fileName } = req.body;
  const file = await deleteFileById(fileId, fileName);
  res.status(httpStatus.CREATED).send(file);
});

const downloadFile = catchAsync(async (req, res) => {
  const { fileId, fileName } = req.body;

  const file = await downloadFileById(fileId, fileName);
  res.status(httpStatus.CREATED).send(file);
});

const cloudController = {
  cloudAuth,
  cloudCallback,
  getFilesList,
  uploadFile,
  deleteFile,
  downloadFile,
};

export default cloudController;
