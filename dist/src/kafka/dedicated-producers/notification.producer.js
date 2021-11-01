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
exports.sendMessage = void 0;
const index_1 = require("../index");
const kafkaConstants_1 = __importDefault(require("../kafkaConstants"));
const logger_util_1 = __importDefault(require("../../server/utils/logger.util"));
// @Todo change client_id to server instance id.
const producer = new index_1.KafkaProducer(kafkaConstants_1.default.NOTIFICATION_SETTINGS.TOPIC, kafkaConstants_1.default.NOTIFICATION_SETTINGS.CLIENT_ID, kafkaConstants_1.default.NOTIFICATION_SETTINGS.BROKERS);
const sendMessage = (type, to, body, executeAt) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        // @todo - check if key is necessary
        key: `${Math.round(Math.random() * 1000)}`,
        value: JSON.stringify({
            type,
            at: executeAt,
            details: {
                to,
                body,
            },
        }),
    };
    const res = yield producer.sendMessage(message);
    return res;
});
exports.sendMessage = sendMessage;
producer.connect().catch((err) => logger_util_1.default.error(err));
//# sourceMappingURL=notification.producer.js.map