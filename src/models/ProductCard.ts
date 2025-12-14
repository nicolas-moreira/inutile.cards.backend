import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProductCard } from '../types/index.js';

export interface IProductCardDocument extends Omit<IProductCard, '_id'>, Document {}

interface IProductCardModel extends Model<IProductCardDocument> {
  findActive(): Promise<IProductCardDocument[]>;
  findLowStock(threshold: number): Promise<IProductCardDocument[]>;
}

const productCardSchema = new Schema<IProductCardDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static methods
productCardSchema.statics.findActive = function () {
  return this.find({ active: true }).sort({ createdAt: -1 });
};

productCardSchema.statics.findLowStock = function (threshold: number = 20) {
  return this.find({ stock: { $lt: threshold }, active: true }).sort({ stock: 1 });
};

export const ProductCard = mongoose.model<IProductCardDocument, IProductCardModel>(
  'ProductCard',
  productCardSchema
);





