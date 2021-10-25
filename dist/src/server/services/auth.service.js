"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtp = exports.verifyEmail = exports.resetPassword = exports.refreshAuth = exports.logout = exports.loginUserWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const tokenService = __importStar(require("./token.service"));
const userService = __importStar(require("./user.service"));
const token_model_1 = __importDefault(require("../models/token.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const tokens_1 = __importDefault(require("../config/tokens"));
const random_1 = require("../utils/random");
const notification_producer_1 = require("../../kafka/dedicated-producers/notification.producer");
const constants_1 = __importDefault(require("../../kafka/dedicated-producers/constants"));
const config_1 = __importDefault(require("../config/config"));
const logger_util_1 = __importDefault(require("../utils/logger.util"));
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
const loginUserWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getUserByEmail(email);
    if (!user || !(yield user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect email or password");
    }
    return user;
});
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshTokenDoc = yield token_model_1.default.findOne({
        token: refreshToken,
        type: tokens_1.default.REFRESH,
        blacklisted: false,
    });
    if (!refreshTokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Not found");
    }
    yield refreshTokenDoc.remove();
});
exports.logout = logout;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTokenDoc = yield tokenService.verifyToken(refreshToken, tokens_1.default.REFRESH);
        const user = yield userService.getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        yield refreshTokenDoc.remove();
        return yield tokenService.generateAuthTokens(user);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Please authenticate");
    }
});
exports.refreshAuth = refreshAuth;
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = (resetPasswordToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetPasswordTokenDoc = yield tokenService.verifyToken(resetPasswordToken, tokens_1.default.RESET_PASSWORD);
        const user = yield userService.getUserById(resetPasswordTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        yield userService.updateUserById(user.id, { password: newPassword });
        yield token_model_1.default.deleteMany({
            user: user.id,
            type: tokens_1.default.RESET_PASSWORD,
        });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password reset failed");
    }
});
exports.resetPassword = resetPassword;
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = (verifyEmailToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyEmailTokenDoc = yield tokenService.verifyToken(verifyEmailToken, tokens_1.default.VERIFY_EMAIL);
        const user = yield userService.getUserById(verifyEmailTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        yield token_model_1.default.deleteMany({
            user: user.id,
            type: tokens_1.default.VERIFY_EMAIL,
        });
        yield userService.updateUserById(user.id, { isEmailVerified: true });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Email verification failed");
    }
});
exports.verifyEmail = verifyEmail;
/**
 * Set OTP for user
 * @param userInfo sendOtp validation params
 * @param {string} userInfo.phoneNumber
 * @param {string} userInfo.idNumber
 * @returns {Promise}
 */
const sendOtp = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, idNumber } = userInfo;
        const user = yield userService.getUserByIdNumber(idNumber);
        if (!user)
            throw new Error("User id not found");
        const isCorrectPhone = user.phoneNumber === phoneNumber;
        // const isCorrectBirthYear = user?.dateOfBirth.getFullYear() === +birthYear;
        if (!isCorrectPhone)
            throw new Error("User not verified");
        const otp = random_1.randomStringNumeric(6);
        const otpObj = {
            passcode: otp,
            created: new Date(),
        };
        const updatedUser = yield userService.updateUserById(user.id, {
            otp: otpObj,
        });
        const body = `Your passcode is: ${otp}`;
        yield notification_producer_1.sendMessage(constants_1.default.NOTIFICATION_TYPES.SMS, updatedUser.phoneNumber, body);
        return updatedUser;
    }
    catch (error) {
        logger_util_1.default.error(error);
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Verification failed");
    }
});
exports.sendOtp = sendOtp;
/**
 * Verify OTP for user
 * @param otpInfo verifyOtp params
 * @param {string} otpInfo.userId
 * @param {string} otpInfo.passcode
 * @returns {Promise}
 */
const verifyOtp = (otpInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, passcode } = otpInfo;
    const user = yield userService.getUserById(userId);
    if (user && config_1.default.env !== "production" && passcode === "111111") {
        return user;
    }
    if (!user || !(yield user.isOtpPasscodeMatch(passcode))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect passcode or passcode has expired");
    }
    return user;
});
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=auth.service.js.map