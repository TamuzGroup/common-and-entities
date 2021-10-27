import { Document, Types, Model } from "mongoose";
export interface IToken {
    token: string;
    user: Types.ObjectId;
    type: string;
    expires: string;
    blacklisted: boolean;
}
export interface ITokenModel extends Model<IToken, Record<string, never>, Record<string, never>> {
}
export declare type ITokenDoc = IToken & Document<Record<string, any>, Record<string, never>, IToken>;
/**
 * @typedef Token
 */
declare const TokenModel: ITokenModel;
export default TokenModel;
//# sourceMappingURL=token.model.d.ts.map