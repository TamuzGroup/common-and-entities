export interface ITransport {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}
