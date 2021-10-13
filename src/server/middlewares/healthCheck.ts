import { Request, Response } from "express-serve-static-core";
import { NextFunction } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

import config from "../config/config";

const isHealthCheckAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { adminKey, to } = req.body;

  if (adminKey !== config.admin.pass)
    next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
  else if (!to)
    next(new ApiError(httpStatus.BAD_REQUEST, '"to" parameter is required'));
  else next();
};

const healthCheckMiddleware = {
  isHealthCheckAuthorized,
};

export default healthCheckMiddleware;
