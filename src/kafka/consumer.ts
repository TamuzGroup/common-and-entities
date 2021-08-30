import { Kafka, Consumer, EachMessagePayload } from "kafkajs";

export default class KafkaConsumer {
  groupId;
  consumer: Consumer;
  kafka: Kafka;
  topic: string;

  constructor(
    groupId: string = "test-group",
    clientId: string = "first-app",
    brokers: string[] = ["localhost:9092"],
    topic: string = "topic-test",
  ) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.groupId = groupId;
    this.consumer = this.kafka.consumer({ groupId: this.groupId });
    this.topic = topic;
  }

  async connect(
    eachMessage: (payload: EachMessagePayload) => Promise<any>
  ): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });
    await this.consumer.run({
      eachMessage,
    });
  }

  disconnect() {
    return this.consumer.disconnect();
  }
}
