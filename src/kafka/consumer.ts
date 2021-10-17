import { Kafka, Consumer, EachMessagePayload, EachBatchPayload } from "kafkajs";

class KafkaConsumer {
  groupId;

  consumer: Consumer;

  kafka: Kafka;

  topic: string;

  constructor(
    groupId = "test-group",
    clientId = "first-app",
    brokers: string[] = ["localhost:9092"],
    topic = "topic-test"
  ) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.groupId = groupId;
    this.consumer = this.kafka.consumer({ groupId: this.groupId });
    this.topic = topic;
  }

  async connect(config?: {
    autoCommit?: boolean;
    autoCommitInterval?: number | null;
    autoCommitThreshold?: number | null;
    eachBatchAutoResolve?: boolean;
    partitionsConsumedConcurrently?: number;
    eachBatch?: (payload: EachBatchPayload) => Promise<void>;
    eachMessage?: (payload: EachMessagePayload) => Promise<void>;
  }): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });
    await this.consumer.run(config);
  }

  disconnect() {
    return this.consumer.disconnect();
  }
}

export default {
  KafkaConsumer,
};
