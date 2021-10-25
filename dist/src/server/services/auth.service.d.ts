import * as tokenService from "./token.service";
import { IUserDoc } from "../models/user.model";
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export declare const loginUserWithEmailAndPassword: (email: string, password: string) => Promise<IUserDoc>;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export declare const logout: (refreshToken: string) => Promise<void>;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export declare const refreshAuth: (refreshToken: string) => Promise<tokenService.AuthTokens>;
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export declare const resetPassword: (resetPasswordToken: string, newPassword: string) => Promise<void>;
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export declare const verifyEmail: (verifyEmailToken: string) => Promise<void>;
/**
 * Set OTP for user
 * @param userInfo sendOtp validation params
 * @param {string} userInfo.phoneNumber
 * @param {string} userInfo.idNumber
 * @returns {Promise}
 */
export declare const sendOtp: (userInfo: {
    phoneNumber: string;
    idNumber: string;
}) => Promise<IUserDoc>;
/**
 * Verify OTP for user
 * @param otpInfo verifyOtp params
 * @param {string} otpInfo.userId
 * @param {string} otpInfo.passcode
 * @returns {Promise}
 */
export declare const verifyOtp: (otpInfo: {
    userId: string;
    passcode: string;
}) => Promise<IUserDoc>;
//# sourceMappingURL=auth.service.d.ts.map