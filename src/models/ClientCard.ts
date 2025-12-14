import mongoose, { Schema, Document, Model } from 'mongoose';
import { IClientCard, ClientCardStatus } from '../types/index.js';

export interface IClientCardDocument extends Omit<IClientCard, '_id'>, Document {}

interface IClientCardModel extends Model<IClientCardDocument> {
  findByOrderId(orderId: string): Promise<IClientCardDocument[]>;
  findByUserId(userId: string): Promise<IClientCardDocument[]>;
  findByStatus(status: ClientCardStatus): Promise<IClientCardDocument[]>;
  findBySerialNumber(serialNumber: string): Promise<IClientCardDocument | null>;
}

const clientCardSchema = new Schema<IClientCardDocument>(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      ref: 'Order',
      index: true,
    },
    userId: {
      type: String,
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
    cardType: {
      type: String,
      required: true,
      trim: true,
    },
    design: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ordered', 'manufacturing', 'shipped', 'delivered', 'activated'] as ClientCardStatus[],
      default: 'ordered',
      index: true,
    },
    shippingAddress: {
      type: String,
      trim: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    deliveryDate: {
      type: Date,
    },
    activatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Static methods
clientCardSchema.statics.findByOrderId = function (orderId: string) {
  return this.find({ orderId }).sort({ createdAt: -1 });
};

clientCardSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

clientCardSchema.statics.findByStatus = function (status: ClientCardStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

clientCardSchema.statics.findBySerialNumber = function (serialNumber: string) {
  return this.findOne({ serialNumber: serialNumber.toUpperCase() });
};

export const ClientCard = mongoose.model<IClientCardDocument, IClientCardModel>(
  'ClientCard',
  clientCardSchema
);





