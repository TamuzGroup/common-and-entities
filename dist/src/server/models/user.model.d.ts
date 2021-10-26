import { AnyObject, Document, EnforceDocument, LeanDocument, Model, QueryWithHelpers, Types, _AllowStringsForIds } from "mongoose";
import { RoleNames } from "../config/roles";
import { PaginationFunc } from "./plugins/paginate.plugin";
export interface IUser {
    name: {
        first: string;
        last: string;
    };
    email: string;
    password: string;
    idNumber: string;
    dateOfBirth: Date;
    role: RoleNames;
    isEmailVerified: boolean;
    phoneNumber: string;
    otp: {
        passcode: string;
        created: Date;
    };
}
/**
 * Methods of the Mongoose DB IUser objects.
 */
export interface IUserMethods {
    isPasswordMatch: (password: string) => Promise<boolean>;
    isOtpPasscodeMatch: (passcode: string) => Promise<boolean>;
}
/**
 * Moogoose DB IUser model type with methods.
 */
export interface IUserModel extends Model<IUser, Record<string, never>, IUserMethods> {
    isEmailTaken: (email: string, excludeUserId?: string | Types.ObjectId) => Promise<boolean>;
    paginate?: PaginationFunc<IUser, IUserMethods>;
}
/**
 * Mongoose DB IUser document type with methods.
 */
export declare type IUserDoc = IUser & Document<Record<string, any>, Record<string, never>, IUser> & IUserMethods;
/**
 * Mongoose DB Query IUser return type.
 */
export declare type IUserQueryWithHelper = QueryWithHelpers<EnforceDocument<IUser, IUserMethods> | null, EnforceDocument<IUser, IUserMethods>, Record<string, never>, IUser>;
/**
 * Moogoose DB general IUser parameter type.
 */
export declare type IUserLeanDoc = IUser | _AllowStringsForIds<LeanDocument<IUser>> | AnyObject;
/**
 * IUser model typed IUserModel instance
 */
declare const UserModel: IUserModel;
export default UserModel;
//# sourceMappingURL=user.model.d.ts.map