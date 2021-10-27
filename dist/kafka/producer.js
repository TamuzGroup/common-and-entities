"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
class KafkaProducer {
    constructor(topic = "topic-test", clientId = "first-app", brokers = ["localhost:9092"]) {
        this.kafka = new kafkajs_1.Kafka({
            clientId,
            brokers,
        });
        this.topic = topic;
        this.producer = this.kafka.producer();
    }
    sendMessage(message) {
        return this.producer
            .send({
            topic: this.topic,
            messages: [message],
        })
            .then(console.log)
            .catch((e) => console.error(`[example/producer] ${e.message}`, e));
    }
    connect() {
        return this.producer.connect();
    }
    disconnect() {
        return this.producer.disconnect();
    }
}
exports.default = KafkaProducer;
//# sourceMappingURL=producer.js.map