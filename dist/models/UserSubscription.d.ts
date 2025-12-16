import { Document, Model } from 'mongoose';
export interface IUserSubscription {
    _id: string;
    userId: string;
    subscriptionId: string;
    status: 'active' | 'cancelled' | 'expired' | 'paused';
    startDate: Date;
    endDate?: Date;
    cancelledAt?: Date;
    autoRenew: boolean;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserSubscriptionDocument extends Omit<IUserSubscription, '_id'>, Document {
}
interface IUserSubscriptionModel extends Model<IUserSubscriptionDocument> {
    findByUserId(userId: string): Promise<IUserSubscriptionDocument[]>;
    findActiveByUserId(userId: string): Promise<IUserSubscriptionDocument | null>;
    findBySubscriptionId(subscriptionId: string): Promise<IUserSubscriptionDocument[]>;
}
export declare const UserSubscription: IUserSubscriptionModel;
export {};
//# sourceMappingURL=UserSubscription.d.ts.map