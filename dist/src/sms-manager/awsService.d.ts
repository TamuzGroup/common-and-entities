import AWS, { SNS } from "aws-sdk";
import { ISmsManager } from "./interfaces/sms.interface";
declare class AwsService implements ISmsManager {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    smsProvider: AWS.SNS;
    constructor(accessKeyId: string, secretAccessKey: string, region: string);
    init(): AWS.SNS;
    sendSms(options: {
        to: string;
        body: string;
    }): Promise<{
        sendTo: string;
        message: SNS.PublishResponse | {
            $response: Response;
        };
    }>;
}
export default AwsService;
//# sourceMappingURL=awsService.d.ts.map