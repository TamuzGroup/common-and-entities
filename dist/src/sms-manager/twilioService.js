"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
const smsHelper_util_1 = require("./utils/smsHelper.util");
const config_1 = __importDefault(require("../config/smsManager/config"));
class TwilioService {
    constructor(accessKeyId, token) {
        this.accessKeyId = accessKeyId;
        this.token = token;
        this.smsProvider = this.init();
    }
    init() {
        return new twilio_1.Twilio(this.accessKeyId, this.token);
    }
    sendSms(options) {
        const sendTo = smsHelper_util_1.normalizePhoneNumber(options.to);
        if (!config_1.default.twilioStatus) {
            // eslint-disable-next-line no-console
            console.log(`Prevented SMS for ${sendTo} -> ${options.body}`);
            return Promise.resolve({
                sendTo,
            });
        }
        return this.smsProvider.messages
            .create({
            from: config_1.default.from,
            to: sendTo,
            body: options.body,
        })
            .then((message) => ({
            message,
            sendTo,
        }));
    }
}
exports.default = TwilioService;
//# sourceMappingURL=twilioService.js.map