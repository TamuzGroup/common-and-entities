import nodemailer from 'nodemailer';
export declare const transport: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
export declare const sendEmail: (to: string, subject: string, text: string) => Promise<void>;
/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export declare const sendResetPasswordEmail: (to: string, token: string) => Promise<void>;
/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
export declare const sendVerificationEmail: (to: string, token: string) => Promise<void>;
//# sourceMappingURL=email.service.d.ts.map