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
  body: string,
  executeAt?: number
): Promise<RecordMetadata[]> => {
  const message = {
    // @todo - check if key is necessary
    key: `${Math.round(Math.random() * 1000)}`,
    value: JSON.stringify({
      type,
      at: executeAt,
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


// export default class NotificationProducer extends KafkaProducer {
//
//   constructor(
//       topic = kafkaConstants.NOTIFICATION_SETTINGS.TOPIC,
//       clientId = kafkaConstants.NOTIFICATION_SETTINGS.CLIENT_ID,
//       brokers: string[] = kafkaConstants.NOTIFICATION_SETTINGS.BROKERS
//   ){
//     super(topic, clientId, brokers);
//   }
// }