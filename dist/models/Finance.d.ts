import mongoose, { Document } from 'mongoose';
import { IUserFinance, IBill, IPhysicalCard } from '../types/index.js';
export interface IUserFinanceDocument extends Omit<IUserFinance, '_id'>, Document {
}
export declare const UserFinance: mongoose.Model<IUserFinanceDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserFinanceDocument, {}, {}> & IUserFinanceDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export interface IBillDocument extends Omit<IBill, '_id'>, Document {
}
export declare const Bill: mongoose.Model<IBillDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBillDocument, {}, {}> & IBillDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export interface IPhysicalCardDocument extends Omit<IPhysicalCard, '_id'>, Document {
}
export declare const PhysicalCard: mongoose.Model<IPhysicalCardDocument, {}, {}, {}, mongoose.Document<unknown, {}, IPhysicalCardDocument, {}, {}> & IPhysicalCardDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Finance.d.ts.map