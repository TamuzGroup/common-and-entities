/// <reference types="qs" />
import { ParamsDictionary } from "express-serve-static-core";
import { RequestHandler } from "express";
declare const catchAsync: <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = import("qs").ParsedQs, Locals extends Record<string, any> = Record<string, any>>(fn: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>) => RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map