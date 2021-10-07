import { Twilio } from "twilio";
import { IMessage, ISmsManager } from "./interfaces/sms.interface";
import { normalizePhoneNumber } from "./utils/smsHelper.util";
import smsManagerSettings from "../config/smsManager/config";

class TwilioService implements ISmsManager {
  accessKeyId: string;

  token: string;

  smsProvider: Twilio;

  constructor(accessKeyId: string, token: string) {
    this.accessKeyId = accessKeyId;
    this.token = token;
    this.smsProvider = this.init();
  }

  init(): Twilio {
    return new Twilio(this.accessKeyId, this.token);
  }

  sendSms(options: IMessage): Promise<{ sendTo: string }> {
    const sendTo = normalizePhoneNumber(options.to);

    if (!smsManagerSettings.twilioStatus) {
      // eslint-disable-next-line no-console
      console.log(`Prevented SMS for ${sendTo} -> ${options.body}`);
      return Promise.resolve({
        sendTo,
      });
    }

    return this.smsProvider.messages
      .create({
        from: smsManagerSettings.from,
        to: sendTo,
        body: options.body,
      })
      .then((message) => ({
        message,
        sendTo,
      }));
  }
}

export default TwilioService;
