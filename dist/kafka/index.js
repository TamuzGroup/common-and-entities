"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducer = exports.KafkaConsumer = void 0;
const consumer_1 = __importDefault(require("./consumer"));
exports.KafkaConsumer = consumer_1.default;
const producer_1 = __importDefault(require("./producer"));
exports.KafkaProducer = producer_1.default;
//# sourceMappingURL=index.js.map