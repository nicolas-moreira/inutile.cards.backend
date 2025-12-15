import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  IUserFinance,
  IPaymentCard,
  IBill,
  ISubscription,
  IPhysicalCard,
  PaymentStatus,
  SubscriptionStatus,
  CardType,
} from '../types/index.js';

// Payment Card Sub-schema
const paymentCardSchema = new Schema<IPaymentCard>(
  {
    id: { type: String, required: true },
    last4: { type: String, required: true },
    brand: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

// Subscription Sub-schema
const subscriptionSchema = new Schema<Omit<ISubscription, '_id'>>(
  {
    userId: { type: String, required: true },
    plan: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'paused'] as SubscriptionStatus[],
      default: 'active',
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { _id: false }
);

// User Finance Document
export interface IUserFinanceDocument extends Omit<IUserFinance, '_id'>, Document {}

const userFinanceSchema = new Schema<IUserFinanceDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: 'User',
      index: true,
    },
    paymentCards: {
      type: [paymentCardSchema],
      default: [],
    },
    subscription: {
      type: subscriptionSchema,
    },
  },
  {
    timestamps: true,
  }
);

export const UserFinance = mongoose.model<IUserFinanceDocument>('UserFinance', userFinanceSchema);

// Bill Document
export interface IBillDocument extends Omit<IBill, '_id'>, Document {}

const billSchema = new Schema<IBillDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'] as PaymentStatus[],
      default: 'pending',
    },
    invoiceUrl: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

billSchema.index({ userId: 1 });
billSchema.index({ status: 1 });

export const Bill = mongoose.model<IBillDocument>('Bill', billSchema);

// Physical Card Document
export interface IPhysicalCardDocument extends Omit<IPhysicalCard, '_id'>, Document {}

const physicalCardSchema = new Schema<IPhysicalCardDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['classic', 'premium', 'metal'] as CardType[],
      required: true,
    },
    status: {
      type: String,
      enum: ['ordered', 'processing', 'shipped', 'delivered'],
      default: 'ordered',
    },
    trackingNumber: {
      type: String,
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

physicalCardSchema.index({ userId: 1 });

export const PhysicalCard = mongoose.model<IPhysicalCardDocument>('PhysicalCard', physicalCardSchema);

// Re-export des interfaces et modèles pour éviter les problèmes d'ESM
export type {
  IUserFinanceDocument,
  IBillDocument,
  IPhysicalCardDocument,
};

