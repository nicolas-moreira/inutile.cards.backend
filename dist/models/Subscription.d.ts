import mongoose, { Document } from 'mongoose';
export interface ISubscription {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    interval: 'monthly' | 'yearly' | 'lifetime';
    features: string[];
    maxProfiles: number;
    maxCards: number;
    customDomain: boolean;
    analytics: boolean;
    priority: number;
    active: boolean;
    stripeProductId?: string;
    stripePriceId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISubscriptionDocument extends Omit<ISubscription, '_id'>, Document {
}
export declare const Subscription: mongoose.Model<ISubscriptionDocument, {}, {}, {}, mongoose.Document<unknown, {}, ISubscriptionDocument, {}, {}> & ISubscriptionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Subscription.d.ts.map