"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const sendSms = {
    body: joi_1.default.object().keys({
        to: joi_1.default.string().required(),
        body: joi_1.default.string().required(),
        executeAt: joi_1.default.date().required(),
        adminKey: joi_1.default.string().required(),
    }),
};
const notificationValidation = {
    sendSms,
};
exports.default = notificationValidation;
//# sourceMappingURL=notification.validation.js.map