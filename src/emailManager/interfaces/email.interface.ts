import { Transporter } from "nodemailer";

export interface IEmailManager {
  init(): Transporter;
  sendEmail(details: IEmailDetails): void;
  service: string;
  user: string;
  pass: string;
}

export interface IEmailDetails {
  to: string;
  body: string;
  subject: string;
  attachments?: [];
  alternatives?: [];
  html?: string;
}
