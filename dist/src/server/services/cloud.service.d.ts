import qs from "qs";
export declare const generateAuthUrl: (cloud: string | string[] | qs.ParsedQs | qs.ParsedQs[] | undefined, accessToken: string | string[] | undefined) => string | Promise<string> | boolean;
export declare const authCallback: (code: string | string[] | qs.ParsedQs | qs.ParsedQs[], userId: string) => Promise<unknown>;
//# sourceMappingURL=cloud.service.d.ts.map