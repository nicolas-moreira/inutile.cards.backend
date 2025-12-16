import mongoose, { Schema, Document, Model } from 'mongoose';

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

export interface IUserSubscriptionDocument extends Omit<IUserSubscription, '_id'>, Document {}

interface IUserSubscriptionModel extends Model<IUserSubscriptionDocument> {
  findByUserId(userId: string): Promise<IUserSubscriptionDocument[]>;
  findActiveByUserId(userId: string): Promise<IUserSubscriptionDocument | null>;
  findBySubscriptionId(subscriptionId: string): Promise<IUserSubscriptionDocument[]>;
}

const userSubscriptionSchema = new Schema<IUserSubscriptionDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    subscriptionId: {
      type: String,
      required: true,
      ref: 'Subscription',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'paused'],
      default: 'active',
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    stripeSubscriptionId: {
      type: String,
      index: true,
    },
    stripeCustomerId: {
      type: String,
    },
    lastPaymentDate: {
      type: Date,
    },
    nextPaymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Static methods
userSubscriptionSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId }).populate('subscriptionId').sort({ createdAt: -1 });
};

userSubscriptionSchema.statics.findActiveByUserId = function (userId: string) {
  return this.findOne({ userId, status: 'active' }).populate('subscriptionId');
};

userSubscriptionSchema.statics.findBySubscriptionId = function (subscriptionId: string) {
  return this.find({ subscriptionId }).populate('userId').sort({ createdAt: -1 });
};

// Indexes
userSubscriptionSchema.index({ userId: 1, status: 1 });
userSubscriptionSchema.index({ subscriptionId: 1, status: 1 });

export const UserSubscription = mongoose.model<IUserSubscriptionDocument, IUserSubscriptionModel>(
  'UserSubscription',
  userSubscriptionSchema
);

