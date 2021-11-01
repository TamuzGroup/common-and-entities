import { RecordMetadata } from "kafkajs";
interface IAuthData {
    cloud: string;
    user_id: string | null;
    refreshToken: string | string[];
}
declare const sendMessage: (authData: IAuthData, userId: string) => Promise<RecordMetadata[]>;
export { sendMessage };
//# sourceMappingURL=cloudStorageTokenMng.producer.d.ts.map