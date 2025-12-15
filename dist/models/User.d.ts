import { Document, Model } from 'mongoose';
import { IUser } from '../types/index.js';
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
interface IUserModel extends Model<IUserDocument> {
    findByEmail(email: string): Promise<IUserDocument | null>;
}
export declare const User: IUserModel;
export {};
//# sourceMappingURL=User.d.ts.map