import mongoose, { Schema, Document, Model } from 'mongoose';

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

export interface ISubscriptionDocument extends Omit<ISubscription, '_id'>, Document {}

const subscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'EUR',
      uppercase: true,
    },
    interval: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    maxProfiles: {
      type: Number,
      default: 1,
    },
    maxCards: {
      type: Number,
      default: 1,
    },
    customDomain: {
      type: Boolean,
      default: false,
    },
    analytics: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    stripeProductId: {
      type: String,
    },
    stripePriceId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// slug index already created by unique: true
subscriptionSchema.index({ active: 1 });

export const Subscription = mongoose.model<ISubscriptionDocument>('Subscription', subscriptionSchema);

