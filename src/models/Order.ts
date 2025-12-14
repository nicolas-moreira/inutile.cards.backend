import mongoose, { Schema, Document, Model } from 'mongoose';
import { IOrder, OrderStatus } from '../types/index.js';

export interface IOrderDocument extends Omit<IOrder, '_id'>, Document {}

interface IOrderModel extends Model<IOrderDocument> {
  findByUserId(userId: string): Promise<IOrderDocument[]>;
  findByStatus(status: OrderStatus): Promise<IOrderDocument[]>;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    items: {
      type: [String],
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'] as OrderStatus[],
      default: 'pending',
      index: true,
    },
    cardDesign: {
      type: String,
      trim: true,
    },
    shippingAddress: {
      type: String,
      trim: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static methods
orderSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

orderSchema.statics.findByStatus = function (status: OrderStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

export const Order = mongoose.model<IOrderDocument, IOrderModel>('Order', orderSchema);





