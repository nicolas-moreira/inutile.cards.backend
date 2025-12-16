import mongoose, { Schema } from 'mongoose';
const companySchema = new Schema({
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
}, {
    timestamps: true,
});
// Static methods
companySchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug: slug.toLowerCase() });
};
companySchema.statics.findByAdminUserId = function (userId) {
    return this.find({ adminUserId: userId });
};
// Indexes
companySchema.index({ status: 1 });
companySchema.index({ createdAt: -1 });
export const Company = mongoose.model('Company', companySchema);
//# sourceMappingURL=Company.js.map