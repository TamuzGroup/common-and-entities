"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const logger_util_1 = __importDefault(require("./logger.util"));
const createPdf = (text, fileName) => {
    // Create a document
    try {
        const doc = new pdfkit_1.default();
        doc.pipe(fs_1.default.createWriteStream(fileName));
        doc.text(text);
        doc.end();
    }
    catch (e) {
        logger_util_1.default.error(e);
    }
};
const helper = {
    createPdf,
};
exports.default = helper;
//# sourceMappingURL=helper.util.js.map