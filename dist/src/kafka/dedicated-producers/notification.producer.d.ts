import { RecordMetadata } from "kafkajs";
declare const sendMessage: (type: string, to: string, body: string, executeAt?: number | undefined) => Promise<RecordMetadata[]>;
export { sendMessage };
//# sourceMappingURL=notification.producer.d.ts.map