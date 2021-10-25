export interface IMongoDBConnectionSettings {
  user: string;
  password: string;
  host: string;
  protocol: string;
  port: number;
  authentication: string;
  db: string;
}