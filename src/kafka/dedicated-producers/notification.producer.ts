import { RecordMetadata } from "kafkajs";
import { KafkaProducer } from "../index";
import kafkaConstants from "../kafkaConstants";
import logger from "../../server/utils/logger.util";

// @Todo change client_id to server instance id.

const producer = new KafkaProducer(
  kafkaConstants.NOTIFICATION_SETTINGS.TOPIC,
  kafkaConstants.NOTIFICATION_SETTINGS.CLIENT_ID,
  kafkaConstants.NOTIFICATION_SETTINGS.BROKERS
);

const sendMessage = async (
  type: string,
  to: string,
  body: string
): Promise<RecordMetadata[]> => {
  const message = {
    key: `${Math.round(Math.random() * 1000)}`,
    value: JSON.stringify({
      type,
      at: new Date().getTime(),
      details: {
        to,
        body,
      },
    }),
  };

  const res = await producer.sendMessage(message);
  return res;
};

producer.connect().catch((err) => logger.error(err));

export { sendMessage };
