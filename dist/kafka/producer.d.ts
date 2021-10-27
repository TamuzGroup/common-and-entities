import { Kafka, Producer } from "kafkajs";
export default class KafkaProducer {
    kafka: Kafka;
    topic: string;
    producer: Producer;
    constructor(topic?: string, clientId?: string, brokers?: string[]);
    sendMessage(message: {
        key: string;
        value: string;
    }): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=producer.d.ts.map