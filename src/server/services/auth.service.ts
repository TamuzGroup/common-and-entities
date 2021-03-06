import httpStatus from "http-status";
import * as tokenService from "./token.service";
import * as userService from "./user.service";
import TokenModel from "../models/token.model";
import ApiError from "../utils/ApiError";
import TokenTypes from "../config/tokens";
import { IUserDoc } from "../models/user.model";
import { randomStringNumeric } from "../utils/random";
import { sendMessage } from "../../kafka/dedicated-producers/notification.producer";
import constants from "../../kafka/dedicated-producers/constants";
import config from "../config/config";
import logger from "../utils/logger.util";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<IUserDoc> => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await TokenModel.findOne({
    token: refreshToken,
    type: TokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (
  refreshToken: string
): Promise<tokenService.AuthTokens> => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      TokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return await tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      TokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await TokenModel.deleteMany({
      user: user.id,
      type: TokenTypes.RESET_PASSWORD,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      TokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await TokenModel.deleteMany({
      user: user.id,
      type: TokenTypes.VERIFY_EMAIL,
    });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

/**
 * Set OTP for user
 * @param userInfo sendOtp validation params
 * @param {string} userInfo.phoneNumber
 * @param {string} userInfo.idNumber
 * @returns {Promise}
 */
export const sendOtp = async (userInfo: {
  phoneNumber: string;
  idNumber: string;
}): Promise<IUserDoc> => {
  try {
    const { phoneNumber, idNumber } = userInfo;
    const user = await userService.getUserByIdNumber(idNumber);
    if (!user) throw new Error("User id not found");
    const isCorrectPhone = user.phoneNumber === phoneNumber;
    // const isCorrectBirthYear = user?.dateOfBirth.getFullYear() === +birthYear;
    if (!isCorrectPhone) throw new Error("User not verified");

    const otp = randomStringNumeric(6);
    const otpObj = {
      passcode: otp,
      created: new Date(),
    };

    const updatedUser = await userService.updateUserById(user.id, {
      otp: otpObj,
    });

    const body = `Your passcode is: ${otp}`;
    await sendMessage(
      constants.NOTIFICATION_TYPES.SMS,
      updatedUser.phoneNumber,
      body
    );

    return updatedUser;
  } catch (error) {
    logger.error(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Verification failed");
  }
};

/**
 * Verify OTP for user
 * @param otpInfo verifyOtp params
 * @param {string} otpInfo.userId
 * @param {string} otpInfo.passcode
 * @returns {Promise}
 */
export const verifyOtp = async (otpInfo: {
  userId: string;
  passcode: string;
}): Promise<IUserDoc> => {
  const { userId, passcode } = otpInfo;
  const user = await userService.getUserById(userId);

  if (user && config.env !== "production" && passcode === "111111") {
    return user;
  }

  if (!user || !(await user.isOtpPasscodeMatch(passcode))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect passcode or passcode has expired"
    );
  }

  return user;
};
