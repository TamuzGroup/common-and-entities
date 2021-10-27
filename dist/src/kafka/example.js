"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const producer = new index_1.KafkaProducer();
const consumer = new index_1.KafkaConsumer();
function getRandomNumber() {
    return Math.round(Math.random() * 1000);
}
const eachMessage = async (payload) => {
    const { topic, partition, message } = payload;
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
    console.log(`- ${prefix} ${message.key}#${message.value}`);
};
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
    process.on(type, async () => {
        try {
            console.log(`process.on ${type}`);
            await producer.disconnect();
            process.exit(0);
        }
        catch (_) {
            process.exit(1);
        }
    });
});
signalTraps.map((type) => {
    // @ts-ignore
    process.once(type, async () => {
        try {
            await producer.disconnect();
        }
        finally {
            process.kill(process.pid, type);
        }
    });
});
//# sourceMappingURL=example.js.map