declare const _default: {
    env: any;
    port: any;
    mongoose: {
        url: string;
        options: {
            useCreateIndex: boolean;
            useNewUrlParser: boolean;
            useUnifiedTopology: boolean;
            dbName: string;
            port: number;
        };
    };
    jwt: {
        secret: any;
        accessExpirationMinutes: any;
        refreshExpirationDays: any;
        resetPasswordExpirationMinutes: any;
        verifyEmailExpirationMinutes: any;
    };
    email: {
        smtp: {
            host: any;
            port: any;
            secure: any;
            auth: {
                user: any;
                pass: any;
            };
            tls: {
                rejectUnauthorized: any;
            };
        };
        from: any;
    };
    awsSmsSettings: {
        access: any;
        secret: any;
    };
    awsBucket: {
        region: any;
    };
    otpExpirationInMinutes: any;
    admin: {
        pass: any;
    };
    googleCloudSettings: {
        clientId: any;
        clientSecret: any;
    };
    dropboxCloudSettings: {
        clientId: any;
        clientSecret: any;
    };
    onedriveCloudSettings: {
        clientId: any;
        clientSecret: any;
    };
};
export default _default;
//# sourceMappingURL=config.d.ts.map