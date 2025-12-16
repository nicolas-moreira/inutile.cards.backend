import { Document, Model } from 'mongoose';
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
    adminUserId: string;
    subscriptionId?: string;
    maxEmployees?: number;
    maxCards?: number;
    status: 'active' | 'suspended' | 'inactive';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICompanyDocument extends Omit<ICompany, '_id'>, Document {
}
interface ICompanyModel extends Model<ICompanyDocument> {
    findBySlug(slug: string): Promise<ICompanyDocument | null>;
    findByAdminUserId(userId: string): Promise<ICompanyDocument[]>;
}
export declare const Company: ICompanyModel;
export {};
//# sourceMappingURL=Company.d.ts.map