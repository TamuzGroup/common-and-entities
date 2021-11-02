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
exports.generateVerifyEmailToken = exports.generateResetPasswordToken = exports.generateAuthTokens = exports.verifyToken = exports.saveToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config/config"));
const userService = __importStar(require("./user.service"));
const token_model_1 = __importDefault(require("../models/token.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const tokens_1 = __importDefault(require("../config/tokens"));
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {TokenTypes} type
 * @param {jwt.Secret} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type = tokens_1.default.ACCESS, secret = config_1.default.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment_1.default().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {TokenTypes} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
const saveToken = (token, userId, expires, type, blacklisted = false) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield token_model_1.default.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
});
exports.saveToken = saveToken;
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {TokenTypes} type
 * @returns {Promise<ITokenDoc>}
 */
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    const tokenDoc = yield token_model_1.default.findOne({
        token,
        type,
        user: typeof payload.sub === 'function' ? payload.sub() : payload.sub,
        blacklisted: false,
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
});
exports.verifyToken = verifyToken;
/**
 * Generate new security auth tokens for the specified user
 *
 * @param {IUserDoc} user
 * @returns {Promise<AuthTokens>}
 */
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenExpires = moment_1.default().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = exports.generateToken(user.id, accessTokenExpires, tokens_1.default.ACCESS);
    const refreshTokenExpires = moment_1.default().add(config_1.default.jwt.refreshExpirationDays, 'days');
    const refreshToken = exports.generateToken(user.id, refreshTokenExpires, tokens_1.default.REFRESH);
    yield exports.saveToken(refreshToken, user.id, refreshTokenExpires, tokens_1.default.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
});
exports.generateAuthTokens = generateAuthTokens;
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment_1.default().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = exports.generateToken(user.id, expires, tokens_1.default.RESET_PASSWORD);
    yield exports.saveToken(resetPasswordToken, user.id, expires, tokens_1.default.RESET_PASSWORD);
    return resetPasswordToken;
});
exports.generateResetPasswordToken = generateResetPasswordToken;
/**
 * Generate verify email token
 * @param {ObjectId} userId
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = moment_1.default().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = exports.generateToken(userId, expires, tokens_1.default.VERIFY_EMAIL);
    yield exports.saveToken(verifyEmailToken, userId, expires, tokens_1.default.VERIFY_EMAIL);
    return verifyEmailToken;
});
exports.generateVerifyEmailToken = generateVerifyEmailToken;
//# sourceMappingURL=token.service.js.map