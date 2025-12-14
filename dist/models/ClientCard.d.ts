import { Document, Model } from 'mongoose';
import { IClientCard, ClientCardStatus } from '../types/index.js';
export interface IClientCardDocument extends Omit<IClientCard, '_id'>, Document {
}
interface IClientCardModel extends Model<IClientCardDocument> {
    findByOrderId(orderId: string): Promise<IClientCardDocument[]>;
    findByUserId(userId: string): Promise<IClientCardDocument[]>;
    findByStatus(status: ClientCardStatus): Promise<IClientCardDocument[]>;
    findBySerialNumber(serialNumber: string): Promise<IClientCardDocument | null>;
}
export declare const ClientCard: IClientCardModel;
export {};
//# sourceMappingURL=ClientCard.d.ts.map