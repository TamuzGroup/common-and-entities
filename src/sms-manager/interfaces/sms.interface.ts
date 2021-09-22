import { Twilio } from "twilio";
import AWS, { SNS } from "aws-sdk";

export interface ISmsManager {
  accessKeyId: string;
  secretAccessKey?: string;
  region?: string;
  token?: string;
  init(): Twilio | AWS.SNS;

  sendSms(options: { to: string; body: string }): Promise<{ sendTo: string; message: SNS.PublishResponse | { $response: Response } }>
}
