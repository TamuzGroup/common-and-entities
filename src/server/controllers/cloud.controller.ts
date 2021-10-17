import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import { generateAuthUrl } from "../services/cloud.service";

const cloudAuth = catchAsync(async (req, res) => {
  const { accessToken } = req.headers;
  const { cloud } = req.query;

  const url = await generateAuthUrl(cloud, accessToken);

  res.status(httpStatus.CREATED).send(url);
});

const cloudController = {
  cloudAuth,
};

export default cloudController;
