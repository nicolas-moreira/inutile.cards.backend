import { Document, Model } from 'mongoose';
import { IProfile } from '../types/index.js';
export interface IProfileDocument extends Omit<IProfile, '_id'>, Document {
}
interface IProfileModel extends Model<IProfileDocument> {
    findBySlug(slug: string): Promise<IProfileDocument | null>;
    findByUserId(userId: string): Promise<IProfileDocument | null>;
}
export declare const Profile: IProfileModel;
export {};
//# sourceMappingURL=Profile.d.ts.map