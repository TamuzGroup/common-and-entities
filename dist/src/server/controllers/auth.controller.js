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
exports.verifyEmail = exports.sendVerificationEmail = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.verifyOtp = exports.sendOtp = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
const authService = __importStar(require("../services/auth.service"));
const userService = __importStar(require("../services/user.service"));
const tokenService = __importStar(require("../services/token.service"));
const emailService = __importStar(require("../services/email.service"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.register = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.createUser(req.body);
    const tokens = yield tokenService.generateAuthTokens(user);
    res.status(http_status_1.default.CREATED).send({ user, tokens });
}));
exports.sendOtp = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield authService.sendOtp(req.body);
    res.status(http_status_1.default.CREATED).send({ userId: updatedUser.id });
}));
exports.verifyOtp = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield authService.verifyOtp(req.body);
    const tokens = yield tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
}));
exports.login = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield authService.loginUserWithEmailAndPassword(email, password);
    const tokens = yield tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
}));
exports.logout = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authService.logout(req.body.refreshToken);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.refreshTokens = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield authService.refreshAuth(req.body.refreshToken);
    res.send(Object.assign({}, tokens));
}));
exports.forgotPassword = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = yield tokenService.generateResetPasswordToken(req.body.email);
    yield emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.resetPassword = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authService.resetPassword(typeof req.query.token === "string" ? req.query.token : "", req.body.password);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.sendVerificationEmail = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqUser = req.user;
    const verifyEmailToken = yield tokenService.generateVerifyEmailToken(reqUser === null || reqUser === void 0 ? void 0 : reqUser.id);
    yield emailService.sendVerificationEmail(reqUser === null || reqUser === void 0 ? void 0 : reqUser.email, verifyEmailToken);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.verifyEmail = catchAsync_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authService.verifyEmail(typeof req.query.token === "string" ? req.query.token : "");
    res.status(http_status_1.default.NO_CONTENT).send();
}));
//# sourceMappingURL=auth.controller.js.map