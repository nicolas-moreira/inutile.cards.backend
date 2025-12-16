import mongoose, { Schema } from 'mongoose';
const userSubscriptionSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
        index: true,
    },
    subscriptionId: {
        type: String,
        required: true,
        ref: 'Subscription',
        index: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'paused'],
        default: 'active',
        index: true,
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    cancelledAt: {
        type: Date,
    },
    autoRenew: {
        type: Boolean,
        default: true,
    },
    stripeSubscriptionId: {
        type: String,
        index: true,
    },
    stripeCustomerId: {
        type: String,
    },
    lastPaymentDate: {
        type: Date,
    },
    nextPaymentDate: {
        type: Date,
    },
    paymentMethod: {
        type: String,
    },
}, {
    timestamps: true,
});
// Static methods
userSubscriptionSchema.statics.findByUserId = function (userId) {
    return this.find({ userId }).populate('subscriptionId').sort({ createdAt: -1 });
};
userSubscriptionSchema.statics.findActiveByUserId = function (userId) {
    return this.findOne({ userId, status: 'active' }).populate('subscriptionId');
};
userSubscriptionSchema.statics.findBySubscriptionId = function (subscriptionId) {
    return this.find({ subscriptionId }).populate('userId').sort({ createdAt: -1 });
};
// Indexes
userSubscriptionSchema.index({ userId: 1, status: 1 });
userSubscriptionSchema.index({ subscriptionId: 1, status: 1 });
export const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema);
//# sourceMappingURL=UserSubscription.js.map