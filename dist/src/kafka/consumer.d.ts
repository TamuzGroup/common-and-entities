import { Kafka, Consumer, EachMessagePayload, EachBatchPayload } from "kafkajs";
export default class KafkaConsumer {
    groupId: string;
    consumer: Consumer;
    kafka: Kafka;
    topic: string;
    constructor(groupId?: string, clientId?: string, brokers?: string[], topic?: string);
    connect(config?: {
        autoCommit?: boolean;
        autoCommitInterval?: number | null;
        autoCommitThreshold?: number | null;
        eachBatchAutoResolve?: boolean;
        partitionsConsumedConcurrently?: number;
        eachBatch?: (payload: EachBatchPayload) => Promise<void>;
        eachMessage?: (payload: EachMessagePayload) => Promise<void>;
    }): Promise<void>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=consumer.d.ts.map