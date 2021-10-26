"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const getFilesList = {
    body: joi_1.default.object().keys({
        folderId: joi_1.default.string().empty(""),
        isRenderChildren: joi_1.default.boolean(),
        cloudType: joi_1.default.string(),
        userId: joi_1.default.string().required(),
    }),
};
const cloudValidation = {
    getFilesList,
};
exports.default = cloudValidation;
//# sourceMappingURL=cloud.validation.js.map