"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
exports.createUser = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().custom(custom_validation_1.password),
        name: {
            first: joi_1.default.string().required(),
            last: joi_1.default.string().required(),
        },
        role: joi_1.default.string().required().valid("user", "admin"),
        dateOfBirth: joi_1.default.date().required(),
        idNumber: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().required(),
    }),
};
exports.getUsers = {
    query: joi_1.default.object().keys({
        name: {
            first: joi_1.default.string().required(),
            last: joi_1.default.string().required(),
        },
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
exports.getUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
exports.updateUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        email: joi_1.default.string().email(),
        password: joi_1.default.string().custom(custom_validation_1.password),
        name: {
            first: joi_1.default.string().required(),
            last: joi_1.default.string().required(),
        },
    })
        .min(1),
};
exports.deleteUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
//# sourceMappingURL=user.validation.js.map