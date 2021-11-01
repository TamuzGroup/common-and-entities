"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const logger_util_1 = __importDefault(require("../server/utils/logger.util"));
class KafkaProducer {
    constructor(topic = "topic-test", clientId = "first-app", brokers = ["localhost:9092"]) {
        this.kafka = new kafkajs_1.Kafka({
            clientId,
            brokers,
        });
        this.brokers = brokers;
        this.topic = topic;
        this.producer = this.kafka.producer();
    }
    sendMessage(message) {
        return this.producer.send({
            topic: this.topic,
            messages: [message],
        });
    }
    connect() {
        logger_util_1.default.info("producer connecting...", "topic", this.topic, "brokers", this.brokers);
        return this.producer.connect();
    }
    disconnect() {
        return this.producer.disconnect();
    }
}
exports.default = KafkaProducer;
//# sourceMappingURL=producer.js.map