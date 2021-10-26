import { RequestHandler } from "express";
import { PassportStatic } from "passport";
import { IUserDoc } from "../models/user.model";
export declare const setPassport: (passportInstance: PassportStatic) => void;
export declare type AuthenticateCallback = (err?: any, user?: IUserDoc, info?: any) => Promise<void>;
declare const auth: (...requiredRights: string[]) => RequestHandler;
export default auth;
//# sourceMappingURL=auth.d.ts.map