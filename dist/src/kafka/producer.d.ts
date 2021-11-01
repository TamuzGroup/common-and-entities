import { Kafka, Producer } from "kafkajs";
export default class KafkaProducer {
    kafka: Kafka;
    topic: string;
    producer: Producer;
    brokers: string[];
    constructor(topic?: string, clientId?: string, brokers?: string[]);
    sendMessage(message: {
        value: string;
        key: string;
    }): Promise<import("kafkajs").RecordMetadata[]>;
    connect(): Promise<void>;
    connectSync(): Promise<void>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=producer.d.ts.map