"use strict";
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
const sendMessage = async (type, to, body, executeAt) => {
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
    const res = await producer.sendMessage(message);
    return res;
};
exports.sendMessage = sendMessage;
producer.connect().catch((err) => logger_util_1.default.error(err));
// export default class NotificationProducer extends KafkaProducer {
//
//   constructor(
//       topic = kafkaConstants.NOTIFICATION_SETTINGS.TOPIC,
//       clientId = kafkaConstants.NOTIFICATION_SETTINGS.CLIENT_ID,
//       brokers: string[] = kafkaConstants.NOTIFICATION_SETTINGS.BROKERS
//   ){
//     super(topic, clientId, brokers);
//   }
// }
//# sourceMappingURL=notification.producer.js.map