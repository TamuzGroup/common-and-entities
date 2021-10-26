"use strict";
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
exports.setPassport = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const roles_1 = require("../config/roles");
let passport;
const setPassport = (passportInstance) => {
    passport = passportInstance;
};
exports.setPassport = setPassport;
/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */
const verifyCallback = (req, resolve, reject, requiredRights) => {
    /* eslint-enable @typescript-eslint/no-explicit-any, no-unused-vars */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || info || !user) {
            return reject(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Please authenticate"));
        }
        req.user = user;
        if (requiredRights.length) {
            const userRights = roles_1.roleRights.get(user.role);
            const hasRequiredRights = userRights &&
                requiredRights.every((requiredRight) => userRights.includes(requiredRight));
            if (!hasRequiredRights && req.params.userId !== user.id) {
                return reject(new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden"));
            }
        }
        resolve();
    });
};
const auth = (...requiredRights) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        passport.authenticate("jwt", { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
});
exports.default = auth;
//# sourceMappingURL=auth.js.map