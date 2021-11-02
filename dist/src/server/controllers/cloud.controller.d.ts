/// <reference types="qs" />
/// <reference types="express" />
declare const cloudController: {
    cloudAuth: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    cloudCallback: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
};
export default cloudController;
//# sourceMappingURL=cloud.controller.d.ts.map