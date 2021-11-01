export interface IMongoDBConnectionSettings {
    user: string;
    password: string;
    host: string;
    protocol: string;
    port: number;
    authentication: string;
    db: string;
}
export declare function getMongoDBConnectionParams(env: string): IMongoDBConnectionSettings;
//# sourceMappingURL=interfaces.d.ts.map