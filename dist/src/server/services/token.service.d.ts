import jwt from 'jsonwebtoken';
import { Moment } from 'moment';
import { Types } from 'mongoose';
import { ITokenDoc } from '../models/token.model';
import TokenTypes from '../config/tokens';
import { IUserDoc } from '../models/user.model';
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {TokenTypes} type
 * @param {jwt.Secret} [secret]
 * @returns {string}
 */
export declare const generateToken: (userId: Types.ObjectId, expires: Moment, type?: TokenTypes, secret?: jwt.Secret) => string;
/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {TokenTypes} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export declare const saveToken: (token: string, userId: Types.ObjectId, expires: Moment, type: TokenTypes, blacklisted?: boolean) => Promise<ITokenDoc>;
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {TokenTypes} type
 * @returns {Promise<ITokenDoc>}
 */
export declare const verifyToken: (token: string, type: TokenTypes) => Promise<ITokenDoc>;
/**
 * The security auth tokens type
 */
export declare type AuthTokens = {
    access: {
        token: string;
        expires: Date;
    };
    refresh: {
        token: string;
        expires: Date;
    };
};
/**
 * Generate new security auth tokens for the specified user
 *
 * @param {IUserDoc} user
 * @returns {Promise<AuthTokens>}
 */
export declare const generateAuthTokens: (user: IUserDoc) => Promise<AuthTokens>;
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export declare const generateResetPasswordToken: (email: string) => Promise<string>;
/**
 * Generate verify email token
 * @param {ObjectId} userId
 * @returns {Promise<string>}
 */
export declare const generateVerifyEmailToken: (userId: Types.ObjectId) => Promise<string>;
//# sourceMappingURL=token.service.d.ts.map