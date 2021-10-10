const NOTIFICATION_SETTINGS = {
  GROUP_ID: "notifications_group",
  TOPIC: "notification_request",
  CLIENT_ID: "notifications_consumer_1",
  BROKERS: ["localhost:9092"],
};

const kafkaConstants = {
  NOTIFICATION_SETTINGS,
};

export default kafkaConstants;
