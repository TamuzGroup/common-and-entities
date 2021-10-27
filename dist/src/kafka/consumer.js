"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
class KafkaConsumer {
    constructor(groupId = "test-group", clientId = "first-app", brokers = ["localhost:9092"], topic = "topic-test") {
        this.kafka = new kafkajs_1.Kafka({
            clientId,
            brokers,
        });
        this.groupId = groupId;
        this.consumer = this.kafka.consumer({ groupId: this.groupId });
        this.topic = topic;
    }
    async connect(config) {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.topic });
        await this.consumer.run(config);
    }
    disconnect() {
        return this.consumer.disconnect();
    }
}
exports.default = KafkaConsumer;
//# sourceMappingURL=consumer.js.map