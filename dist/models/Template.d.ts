import { Document, Model } from 'mongoose';
import { ITemplate } from '../types/index.js';
export interface ITemplateDocument extends Omit<ITemplate, '_id'>, Document {
}
interface ITemplateModel extends Model<ITemplateDocument> {
    findActiveTemplates(): Promise<ITemplateDocument[]>;
}
export declare const Template: ITemplateModel;
export {};
//# sourceMappingURL=Template.d.ts.map