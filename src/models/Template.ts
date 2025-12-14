import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITemplate, IProfileTheme } from '../types/index.js';

export interface ITemplateDocument extends Omit<ITemplate, '_id'>, Document {}

interface ITemplateModel extends Model<ITemplateDocument> {
  findActiveTemplates(): Promise<ITemplateDocument[]>;
}

const themeSchema = new Schema<IProfileTheme>(
  {
    backgroundColor: { type: String, default: '#0a0a0a' },
    textColor: { type: String, default: '#ffffff' },
    buttonColor: { type: String, default: '#d4af37' },
    buttonTextColor: { type: String, default: '#0a0a0a' },
    buttonStyle: {
      type: String,
      enum: ['rounded', 'square', 'pill'],
      default: 'rounded',
    },
    fontFamily: { type: String, default: 'Inter' },
  },
  { _id: false }
);

const templateSchema = new Schema<ITemplateDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
    },
    theme: {
      type: themeSchema,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Static methods
templateSchema.statics.findActiveTemplates = function () {
  return this.find({ isActive: true }).sort({ isPremium: 1, name: 1 });
};

export const Template = mongoose.model<ITemplateDocument, ITemplateModel>('Template', templateSchema);



