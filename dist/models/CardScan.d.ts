import { Document, Model } from 'mongoose';
export interface ICardScan {
    _id: string;
    cardId: string;
    serialNumber: string;
    userId?: string;
    scanDate: Date;
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
    country?: string;
    city?: string;
    device?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    browser?: string;
    createdAt: Date;
}
export interface ICardScanDocument extends Omit<ICardScan, '_id'>, Document {
}
interface ICardScanModel extends Model<ICardScanDocument> {
    findByCardId(cardId: string): Promise<ICardScanDocument[]>;
    findByUserId(userId: string): Promise<ICardScanDocument[]>;
    findBySerialNumber(serialNumber: string): Promise<ICardScanDocument[]>;
    getCardStats(cardId: string): Promise<any>;
    getUserStats(userId: string): Promise<any>;
}
export declare const CardScan: ICardScanModel;
export {};
//# sourceMappingURL=CardScan.d.ts.map