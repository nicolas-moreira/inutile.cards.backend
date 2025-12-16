import mongoose, { Schema } from 'mongoose';
const subscriptionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: 'EUR',
        uppercase: true,
    },
    interval: {
        type: String,
        enum: ['monthly', 'yearly', 'lifetime'],
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
    maxProfiles: {
        type: Number,
        default: 1,
    },
    maxCards: {
        type: Number,
        default: 1,
    },
    customDomain: {
        type: Boolean,
        default: false,
    },
    analytics: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: Number,
        default: 0,
    },
    active: {
        type: Boolean,
        default: true,
    },
    stripeProductId: {
        type: String,
    },
    stripePriceId: {
        type: String,
    },
}, {
    timestamps: true,
});
// slug index already created by unique: true
subscriptionSchema.index({ active: 1 });
export const Subscription = mongoose.model('Subscription', subscriptionSchema);
//# sourceMappingURL=Subscription.js.map