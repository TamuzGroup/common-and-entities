"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const smsHelper_util_1 = require("./utils/smsHelper.util");
const config_1 = __importDefault(require("../config/smsManager/config"));
class AwsService {
    constructor(accessKeyId, secretAccessKey, region) {
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.region = region;
        this.smsProvider = this.init();
    }
    init() {
        aws_sdk_1.default.config.update({
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
            region: this.region,
        });
        return new aws_sdk_1.default.SNS({ apiVersion: config_1.default.apiVersion });
    }
    sendSms(options) {
        const sendTo = smsHelper_util_1.normalizePhoneNumber(options.to);
        const params = {
            Message: options.body,
            PhoneNumber: sendTo,
            MessageAttributes: {
                "AWS.SNS.SMS.SenderID": {
                    DataType: "String",
                    StringValue: config_1.default.appName,
                },
            },
        };
        const publishTextPromise = this.smsProvider.publish(params).promise();
        return publishTextPromise.then((message) => ({
            message,
            sendTo,
        }));
    }
}
exports.default = AwsService;
//# sourceMappingURL=awsService.js.map