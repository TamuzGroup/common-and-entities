import { RecordMetadata } from "kafkajs";
import { KafkaProducer } from "../index";
import kafkaConstants from "../kafkaConstants";
import logger from "../../server/utils/logger.util";

interface IAuthData {
  cloud: string;
  user_id: string | null;
  refreshToken: string | string[];
}

const producer = new KafkaProducer(
  kafkaConstants.CLOUD_STORAGE_TOKEN_MNG.TOPIC,
  kafkaConstants.CLOUD_STORAGE_TOKEN_MNG.CLIENT_ID,
  kafkaConstants.CLOUD_STORAGE_TOKEN_MNG.BROKERS
);

const sendMessage = async (
  authData: IAuthData,
  userId: string
): Promise<RecordMetadata[]> => {
  const message = {
    key: `${Math.round(Math.random() * 1000)}`,
    value: JSON.stringify({
      cloud_type: authData.cloud,
      user_id: userId || null,
      tokens: authData.refreshToken,
    }),
  };

  return producer.sendMessage(message);
};

producer.connect().catch((err) => logger.error(err));

export { sendMessage };
