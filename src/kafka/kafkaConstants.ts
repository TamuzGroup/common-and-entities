const NOTIFICATION_SETTINGS = {
  GROUP_ID: "notifications_group",
  TOPIC: "notification_request",
  CLIENT_ID: "notifications_consumer_1",
  // BROKERS: ["localhost:9092"],
  BROKERS: ["172.30.0.3:9092"],
};

const CLOUD_STORAGE_TOKEN_MNG = {
  GROUP_ID: "cloud_storage_token_mng_group_id",
  TOPIC: "cloud_storage_token_mng",
  CLIENT_ID: "cloud_storage_token_mng_consumer_id",
  // BROKERS: ["localhost:9092"],
  BROKERS: ["172.30.0.3:9092"],
};

const kafkaConstants = {
  NOTIFICATION_SETTINGS,
  CLOUD_STORAGE_TOKEN_MNG,
};

export default kafkaConstants;
