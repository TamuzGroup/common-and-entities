import { Transporter } from "nodemailer";
import { IEmailDetails, IEmailManager } from "./interfaces/email.interface";
declare class EmailService implements IEmailManager {
    service: string;
    user: string;
    pass: string;
    emailProvider: Transporter;
    constructor();
    init(): Transporter;
    sendEmail(details: IEmailDetails): void;
}
export default EmailService;
//# sourceMappingURL=emailService.d.ts.map