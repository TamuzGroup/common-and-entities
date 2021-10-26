"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
const index_1 = require("../../index");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string()
        .valid("production", "development", "test")
        .required(),
    PORT: joi_1.default.number().default(3000),
    // MONGO_HOST: Joi.string().required(),
    // MONGO_DB: Joi.string().required(),
    // MONGO_PORT: Joi.number().required(),
    // MONGO_USER: Joi.string().required(),
    // MONGO_PASSWORD: Joi.string().required(),
    // MONGO_PROTOCOL: Joi.string().required(),
    // MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: joi_1.default.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: joi_1.default.number()
        .default(30)
        .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: joi_1.default.number()
        .default(30)
        .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi_1.default.number()
        .default(10)
        .description("minutes after which verify email token expires"),
    SMTP_HOST: joi_1.default.string().description("server that will send the emails"),
    SMTP_PORT: joi_1.default.number().description("port to connect to the email server"),
    SMTP_SECURE: joi_1.default.boolean().description("Use TLS or upgrade later with STARTTLS"),
    SMTP_REJECT_SELFSIGNED_CERTS: joi_1.default.boolean().description("Accept or Reject self-signed certificates."),
    SMTP_USERNAME: joi_1.default.string().description("username for email server"),
    SMTP_PASSWORD: joi_1.default.string().description("password for email server"),
    EMAIL_FROM: joi_1.default.string().description("the from field in the emails sent by the app"),
    AWS_SMS_ACCESS: joi_1.default.string().description("aws sms access token"),
    AWS_SMS_SECRET: joi_1.default.string().description("aws sms secret"),
    AWS_BUCKET_REGION: joi_1.default.string().description("aws bucket region"),
    OTP_EXPIRATION_IN_MINUTES: joi_1.default.number()
        .required()
        .description("the time that the authentication otp is valid"),
    ADMIN_PASS: joi_1.default.string().description("admin password for route validation"),
    GOOGLE_ID: joi_1.default.string().description("google drive client id"),
    GOOGLE_SECRET: joi_1.default.string().description("google drive client secret"),
    DROPBOX_ID: joi_1.default.string().description("dropbox drive client id"),
    DROPBOX_SECRET: joi_1.default.string().description("dropbox drive client secret"),
    ONEDRIVE_ID: joi_1.default.string().description("onedrive drive client id"),
    ONEDRIVE_SECRET: joi_1.default.string().description("onedrive drive client secret"),
})
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const mongoDBConfig = index_1.getMongoDBConnectionParams(envVars.NODE_ENV); // take default settings
const dbURL = `${mongoDBConfig.protocol}://${mongoDBConfig.user}:${mongoDBConfig.password}@${mongoDBConfig.host}:${mongoDBConfig.port}`;
// eslint-disable-next-line no-console
console.info(`@@Mongodb:${dbURL}`);
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        // url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        url: dbURL,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: mongoDBConfig.db,
            port: mongoDBConfig.port,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            secure: envVars.SMTP_SECURE,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: envVars.SMTP_REJECT_SELFSIGNED_CERTS,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    awsSmsSettings: {
        access: envVars.AWS_SMS_ACCESS,
        secret: envVars.AWS_SMS_SECRET,
    },
    awsBucket: {
        region: envVars.AWS_BUCKET_REGION,
    },
    otpExpirationInMinutes: envVars.OTP_EXPIRATION_IN_MINUTES,
    admin: {
        pass: envVars.ADMIN_PASS,
    },
    googleCloudSettings: {
        clientId: envVars.GOOGLE_ID,
        clientSecret: envVars.GOOGLE_SECRET,
    },
    dropboxCloudSettings: {
        clientId: envVars.DROPBOX_ID,
        clientSecret: envVars.DROPBOX_SECRET,
    },
    onedriveCloudSettings: {
        clientId: envVars.ONEDRIVE_ID,
        clientSecret: envVars.ONEDRIVE_SECRET,
    },
};
//# sourceMappingURL=config.js.map