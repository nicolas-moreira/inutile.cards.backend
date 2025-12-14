import mongoose, { Schema } from 'mongoose';
const orderSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
        index: true,
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    items: {
        type: [String],
        required: true,
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending',
        index: true,
    },
    cardDesign: {
        type: String,
        trim: true,
    },
    shippingAddress: {
        type: String,
        trim: true,
    },
    trackingNumber: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// Static methods
orderSchema.statics.findByUserId = function (userId) {
    return this.find({ userId }).sort({ createdAt: -1 });
};
orderSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
export const Order = mongoose.model('Order', orderSchema);
//# sourceMappingURL=Order.js.map