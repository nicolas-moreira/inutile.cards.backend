import { Document, Model } from 'mongoose';
import { IProductCard } from '../types/index.js';
export interface IProductCardDocument extends Omit<IProductCard, '_id'>, Document {
}
interface IProductCardModel extends Model<IProductCardDocument> {
    findActive(): Promise<IProductCardDocument[]>;
    findLowStock(threshold: number): Promise<IProductCardDocument[]>;
}
export declare const ProductCard: IProductCardModel;
export {};
//# sourceMappingURL=ProductCard.d.ts.map