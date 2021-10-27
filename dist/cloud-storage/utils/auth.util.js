"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const defaultHeaders = (authToken) => ({
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json; charset=utf-8",
});
const defaultFetchOptions = (options) => ({
    method: options.method || "GET",
    mode: "cors",
    cache: "no-cache",
    body: {},
    headers: {},
});
function axiosRequest(path, options) {
    const authToken = options.auth ? options.auth : null;
    const headers = defaultHeaders(authToken);
    const fetchOptions = defaultFetchOptions(options);
    if (options.data)
        fetchOptions.body = options.data;
    if (options.headers) {
        options.headers.forEach(([key, val]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            headers[key] = val;
            if (val === null) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                delete headers[key];
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchOptions.headers = new node_fetch_1.default.Headers(headers);
    return axios_1.default
        .request({
        method: fetchOptions.method,
        url: path,
        headers,
        data: fetchOptions.body,
    })
        .then((response) => {
        if (response.status === 200)
            return response.data;
    });
}
exports.axiosRequest = axiosRequest;
//# sourceMappingURL=auth.util.js.map