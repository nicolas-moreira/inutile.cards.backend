import { Document, Model } from 'mongoose';
import { IOrder, OrderStatus } from '../types/index.js';
export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {
}
interface IOrderModel extends Model<IOrderDocument> {
    findByUserId(userId: string): Promise<IOrderDocument[]>;
    findByStatus(status: OrderStatus): Promise<IOrderDocument[]>;
}
export declare const Order: IOrderModel;
export {};
//# sourceMappingURL=Order.d.ts.map