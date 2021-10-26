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
const index_1 = require("./index");
const producer = new index_1.KafkaProducer();
const consumer = new index_1.KafkaConsumer();
function getRandomNumber() {
    return Math.round(Math.random() * 1000);
}
const eachMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, partition, message } = payload;
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
    console.log(`- ${prefix} ${message.key}#${message.value}`);
});
consumer
    .connect({ eachMessage })
    .then(() => producer.connect())
    .then(() => producer.sendMessage({
    key: `${getRandomNumber()}`,
    value: JSON.stringify({
        data: { date: `${new Date().getTime()}`, test: "test" },
    }),
}))
    .catch((e) => console.log({ e }));
const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];
errorTypes.map((type) => {
    // @ts-ignore
    process.on(type, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`process.on ${type}`);
            yield producer.disconnect();
            process.exit(0);
        }
        catch (_) {
            process.exit(1);
        }
    }));
});
signalTraps.map((type) => {
    // @ts-ignore
    process.once(type, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield producer.disconnect();
        }
        finally {
            process.kill(process.pid, type);
        }
    }));
});
//# sourceMappingURL=example.js.map