"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const index_1 = require("../index");
const kafkaConstants_1 = __importDefault(require("../kafkaConstants"));
const logger_util_1 = __importDefault(require("../../server/utils/logger.util"));
const producer = new index_1.KafkaProducer(kafkaConstants_1.default.CLOUD_STORAGE_TOKEN_MNG.TOPIC, kafkaConstants_1.default.CLOUD_STORAGE_TOKEN_MNG.CLIENT_ID, kafkaConstants_1.default.CLOUD_STORAGE_TOKEN_MNG.BROKERS);
const sendMessage = async (authData, userId) => {
    const message = {
        key: `${Math.round(Math.random() * 1000)}`,
        value: JSON.stringify({
            cloud_type: authData.cloud,
            user_id: userId || null,
            tokens: authData.refreshToken,
        }),
    };
    return producer.sendMessage(message);
};
exports.sendMessage = sendMessage;
producer.connect().catch((err) => logger_util_1.default.error(err));
//# sourceMappingURL=cloudStorageTokenMng.producer.js.map