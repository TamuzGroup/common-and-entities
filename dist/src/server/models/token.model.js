"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const tokens_1 = __importDefault(require("../config/tokens"));
const mongooseInstance_1 = require("../mongooseInstance");
const mongooseInstance = mongooseInstance_1.getMongooseInstance();
const tokenSchema = new mongooseInstance.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: [
            tokens_1.default.REFRESH,
            tokens_1.default.RESET_PASSWORD,
            tokens_1.default.VERIFY_EMAIL,
        ],
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON_plugin_1.default);
/**
 * @typedef Token
 */
const TokenModel = mongooseInstance.model("Token", tokenSchema);
exports.default = TokenModel;
//# sourceMappingURL=token.model.js.map