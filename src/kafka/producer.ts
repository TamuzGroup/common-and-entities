import { Kafka, Producer } from "kafkajs";
import MessageInterface from "./interfaces/message.interface";

export default class KafkaProducer {
  kafka: Kafka;

  topic: string;

  producer: Producer;

  constructor(
    topic = "topic-test",
    clientId = "first-app",
    brokers: string[] = ["localhost:9092"]
  ) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.topic = topic;
    this.producer = this.kafka.producer();
  }

  sendMessage(message: MessageInterface) {
    return this.producer.send({
      topic: this.topic,
      messages: [message],
    });
  }

  connect() {
    return this.producer.connect();
  }

  disconnect() {
    return this.producer.disconnect();
  }
}
