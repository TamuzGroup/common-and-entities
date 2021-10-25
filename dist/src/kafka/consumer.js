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
    connect(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            yield this.consumer.subscribe({ topic: this.topic });
            yield this.consumer.run(config);
        });
    }
    disconnect() {
        return this.consumer.disconnect();
    }
}
exports.default = KafkaConsumer;
//# sourceMappingURL=consumer.js.map