"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const getToken = {
    body: joi_1.default.object().keys({
        userId: joi_1.default.string().required(),
    }),
};
const safeBoxValidation = {
    getToken,
};
exports.default = safeBoxValidation;
//# sourceMappingURL=safebox.validation.js.map