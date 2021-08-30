import { Kafka, Producer } from "kafkajs";

export default class KafkaProducer {
  kafka: Kafka;
  topic: string;
  producer: Producer;

  constructor(
    topic: string = "topic-test",
    clientId: string = "first-app",
    brokers: string[] = ["localhost:9092"]
  ) {
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.topic = topic;
    this.producer = this.kafka.producer();
  }

  sendMessage(message: { key: string; value: string }) {
    return this.producer
      .send({
        topic: this.topic,
        messages: [message],
      })
      .then(console.log)
      .catch((e) => console.error(`[example/producer] ${e.message}`, e));
  }

  connect() {
    return this.producer.connect();
  }

  disconnect() {
    return this.producer.disconnect();
  }
}
