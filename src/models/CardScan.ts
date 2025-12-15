import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICardScan {
  _id: string;
  cardId: string; // Reference to ClientCard
  serialNumber: string;
  userId?: string; // Owner of the card
  scanDate: Date;
  // Analytics data
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  country?: string;
  city?: string;
  device?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser?: string;
  createdAt: Date;
}

export interface ICardScanDocument extends Omit<ICardScan, '_id'>, Document {}

interface ICardScanModel extends Model<ICardScanDocument> {
  findByCardId(cardId: string): Promise<ICardScanDocument[]>;
  findByUserId(userId: string): Promise<ICardScanDocument[]>;
  findBySerialNumber(serialNumber: string): Promise<ICardScanDocument[]>;
  getCardStats(cardId: string): Promise<any>;
  getUserStats(userId: string): Promise<any>;
}

const cardScanSchema = new Schema<ICardScanDocument>(
  {
    cardId: {
      type: String,
      required: true,
      ref: 'ClientCard',
      index: true,
    },
    serialNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    userId: {
      type: String,
      ref: 'User',
      index: true,
    },
    scanDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    referer: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown',
    },
    browser: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
cardScanSchema.index({ cardId: 1, scanDate: -1 });
cardScanSchema.index({ userId: 1, scanDate: -1 });
cardScanSchema.index({ serialNumber: 1, scanDate: -1 });

// Static methods
cardScanSchema.statics.findByCardId = function (cardId: string) {
  return this.find({ cardId }).sort({ scanDate: -1 });
};

cardScanSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId }).sort({ scanDate: -1 });
};

cardScanSchema.statics.findBySerialNumber = function (serialNumber: string) {
  return this.find({ serialNumber: serialNumber.toUpperCase() }).sort({ scanDate: -1 });
};

cardScanSchema.statics.getCardStats = async function (cardId: string) {
  const totalScans = await this.countDocuments({ cardId });
  
  // Get scans by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const scansByDate = await this.aggregate([
    {
      $match: {
        cardId,
        scanDate: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$scanDate' } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Get scans by device
  const scansByDevice = await this.aggregate([
    {
      $match: { cardId },
    },
    {
      $group: {
        _id: '$device',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalScans,
    scansByDate,
    scansByDevice,
  };
};

cardScanSchema.statics.getUserStats = async function (userId: string) {
  const totalScans = await this.countDocuments({ userId });
  
  // Get scans by card
  const scansByCard = await this.aggregate([
    {
      $match: { userId },
    },
    {
      $group: {
        _id: '$serialNumber',
        count: { $sum: 1 },
        lastScan: { $max: '$scanDate' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  // Get scans by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const scansByDate = await this.aggregate([
    {
      $match: {
        userId,
        scanDate: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$scanDate' } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return {
    totalScans,
    scansByCard,
    scansByDate,
  };
};

export const CardScan = mongoose.model<ICardScanDocument, ICardScanModel>(
  'CardScan',
  cardScanSchema
);

