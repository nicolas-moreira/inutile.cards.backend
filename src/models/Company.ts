import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompany {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  industry?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  adminUserId: string; // Main admin/owner of the company
  subscriptionId?: string;
  maxEmployees?: number;
  maxCards?: number;
  status: 'active' | 'suspended' | 'inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanyDocument extends Omit<ICompany, '_id'>, Document {}

interface ICompanyModel extends Model<ICompanyDocument> {
  findBySlug(slug: string): Promise<ICompanyDocument | null>;
  findByAdminUserId(userId: string): Promise<ICompanyDocument[]>;
}

const companySchema = new Schema<ICompanyDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    adminUserId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    subscriptionId: {
      type: String,
      ref: 'Subscription',
      index: true,
    },
    maxEmployees: {
      type: Number,
      default: 10,
    },
    maxCards: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'inactive'],
      default: 'active',
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Static methods
companySchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug: slug.toLowerCase() });
};

companySchema.statics.findByAdminUserId = function (userId: string) {
  return this.find({ adminUserId: userId });
};

// Indexes
companySchema.index({ status: 1 });
companySchema.index({ createdAt: -1 });

export const Company = mongoose.model<ICompanyDocument, ICompanyModel>('Company', companySchema);

