import nodemailer, { Transporter } from "nodemailer";
import { IEmailDetails, IEmailManager } from "./interfaces/email.interface";
import emailManagerSettings from "../config/emailManager/config";
import { ITransport } from "../config/emailManager/interfaces";

class EmailService implements IEmailManager {
  service: string;

  user: string;

  pass: string;

  emailProvider: Transporter;

  constructor() {
    const { serviceType, from, password } = emailManagerSettings;
    this.service = serviceType;
    this.user = from;
    this.pass = password;
    this.emailProvider = this.init();
  }

  init(): Transporter {
    const transport: ITransport = {
      service: this.service,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    };
    return nodemailer.createTransport(transport);
  }

  sendEmail(details: IEmailDetails): void {
    const mailOptions = {
      from: emailManagerSettings.from,
      to: details.to,
      subject: details.subject,
      text: details.body,
    };
    this.emailProvider.sendMail(mailOptions, (err, data) => {
      if (err) console.log({ err });
      else console.log("email submitted", data);
    });
  }
}

export default EmailService;
