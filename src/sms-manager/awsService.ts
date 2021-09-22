import { ISmsManager } from "./interfaces/sms.interface";
import AWS, { SNS } from "aws-sdk";
import { normalizePhoneNumber } from "./utils/smsHelper.util";
import smsManagerSettings from "../config/smsManager/config.json";

class AwsService implements ISmsManager {
  accessKeyId: string;

  secretAccessKey: string

  region: string

  smsProvider: AWS.SNS;


  constructor(accessKeyId: string, secretAccessKey: string, region: string) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey
    this.region = region
    this.smsProvider = this.init();
  }

  init(): AWS.SNS {
    AWS.config.update({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region,
    });

    return new AWS.SNS({ apiVersion: smsManagerSettings.apiVersion });
  }

  sendSms(options: { to: string; body: string }): Promise<{ sendTo: string; message: SNS.PublishResponse | { $response: Response } }> {
    const sendTo = normalizePhoneNumber(options.to);

      const params = {
        Message: options.body,
        PhoneNumber: sendTo,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: smsManagerSettings.appName,
          },
        },
      };

      const publishTextPromise = this.smsProvider
        .publish(params).promise();

      return publishTextPromise
        .then((message) => ({
          message,
          sendTo,
        }));
    }
}

export default AwsService;
