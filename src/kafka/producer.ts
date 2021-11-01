import { Kafka, Producer } from "kafkajs";
import MessageInterface from "./interfaces/message.interface";
import logger from "../server/utils/logger.util";

export default class KafkaProducer {
  kafka: Kafka;

  topic: string;

  producer: Producer;
  brokers: string[];

  constructor(
    topic = "topic-test",
    clientId = "first-app",
    brokers: string[] = ["localhost:9092"]
  ) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.brokers = brokers;
    this.topic = topic;
    this.producer = this.kafka.producer();
  }

  sendMessage(message: { value: string; key: string }) {
    return this.producer.send({
      topic: this.topic,
      messages: [message],
    });
  }

  connect() {
    return this.producer.connect();
  }

  async connectSync() {
    try {
      const connected = await this.producer.connect();
      logger.info("producer connected", "topic", this.topic, "brokers", this.brokers)
      return connected;
    }
    catch(e) { logger.error( e ) }
  }

  disconnect() {
    return this.producer.disconnect();
  }
}
