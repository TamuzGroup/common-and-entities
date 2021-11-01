import { Twilio } from "twilio";
import { IMessage, ISmsManager } from "./interfaces/sms.interface";
declare class TwilioService implements ISmsManager {
    accessKeyId: string;
    token: string;
    smsProvider: Twilio;
    constructor(accessKeyId: string, token: string);
    init(): Twilio;
    sendSms(options: IMessage): Promise<{
        sendTo: string;
    }>;
}
export default TwilioService;
//# sourceMappingURL=twilioService.d.ts.map