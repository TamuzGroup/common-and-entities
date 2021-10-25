"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/emailManager/config"));
class EmailService {
    constructor() {
        const { serviceType, from, password } = config_1.default;
        this.service = serviceType;
        this.user = from;
        this.pass = password;
        this.emailProvider = this.init();
    }
    init() {
        const transport = {
            service: this.service,
            auth: {
                user: this.user,
                pass: this.pass,
            },
        };
        return nodemailer_1.default.createTransport(transport);
    }
    sendEmail(details) {
        const mailOptions = {
            from: config_1.default.from,
            to: details.to,
            subject: details.subject,
            text: details.body,
            attachments: details.attachments,
            alternatives: details.alternatives,
            html: details.html,
        };
        this.emailProvider.sendMail(mailOptions, (err, data) => {
            if (err)
                console.log({ err });
            else
                console.log("email submitted", data);
        });
    }
}
exports.default = EmailService;
//# sourceMappingURL=emailService.js.map