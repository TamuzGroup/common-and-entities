"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.verifyOTP = exports.sendOTP = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
exports.register = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_validation_1.password),
        name: {
            first: joi_1.default.string().required(),
            last: joi_1.default.string().required(),
        },
        dateOfBirth: joi_1.default.date().required(),
        idNumber: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().required(),
    }),
};
exports.sendOTP = {
    body: joi_1.default.object().keys({
        // @TODO - add custom rules validators
        idNumber: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().required(),
    }),
};
exports.verifyOTP = {
    body: joi_1.default.object().keys({
        // @TODO - add custom rules validators
        passcode: joi_1.default.string().required(),
        userId: joi_1.default.string().required(),
    }),
};
exports.login = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
};
exports.logout = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.refreshTokens = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.forgotPassword = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    }),
};
exports.resetPassword = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
    body: joi_1.default.object().keys({
        password: joi_1.default.string().required().custom(custom_validation_1.password),
    }),
};
exports.verifyEmail = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
//# sourceMappingURL=auth.validation.js.map