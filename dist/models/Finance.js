import mongoose, { Schema } from 'mongoose';
// Payment Card Sub-schema
const paymentCardSchema = new Schema({
    id: { type: String, required: true },
    last4: { type: String, required: true },
    brand: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    isDefault: { type: Boolean, default: false },
}, { _id: false });
// Subscription Sub-schema
const subscriptionSchema = new Schema({
    userId: { type: String, required: true },
    plan: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'paused'],
        default: 'active',
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
}, { _id: false });
const userFinanceSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        ref: 'User',
        index: true,
    },
    paymentCards: {
        type: [paymentCardSchema],
        default: [],
    },
    subscription: {
        type: subscriptionSchema,
    },
}, {
    timestamps: true,
});
export const UserFinance = mongoose.model('UserFinance', userFinanceSchema);
const billSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'EUR',
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    invoiceUrl: {
        type: String,
    },
    paidAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
billSchema.index({ userId: 1 });
billSchema.index({ status: 1 });
export const Bill = mongoose.model('Bill', billSchema);
const physicalCardSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['classic', 'premium', 'metal'],
        required: true,
    },
    status: {
        type: String,
        enum: ['ordered', 'processing', 'shipped', 'delivered'],
        default: 'ordered',
    },
    trackingNumber: {
        type: String,
    },
    orderedAt: {
        type: Date,
        default: Date.now,
    },
    shippedAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
physicalCardSchema.index({ userId: 1 });
export const PhysicalCard = mongoose.model('PhysicalCard', physicalCardSchema);
//# sourceMappingURL=Finance.js.map