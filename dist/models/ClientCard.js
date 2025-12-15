import mongoose, { Schema } from 'mongoose';
const clientCardSchema = new Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    orderId: {
        type: String,
        ref: 'Order',
        index: true,
    },
    userId: {
        type: String,
        ref: 'User',
        index: true,
    },
    profileId: {
        type: String,
        ref: 'Profile',
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
    cardType: {
        type: String,
        required: true,
        trim: true,
    },
    design: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['ordered', 'manufacturing', 'shipped', 'delivered', 'activated'],
        default: 'ordered',
        index: true,
    },
    shippingAddress: {
        type: String,
        trim: true,
    },
    trackingNumber: {
        type: String,
        trim: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    deliveryDate: {
        type: Date,
    },
    activatedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
// Static methods
clientCardSchema.statics.findByOrderId = function (orderId) {
    return this.find({ orderId }).sort({ createdAt: -1 });
};
clientCardSchema.statics.findByUserId = function (userId) {
    return this.find({ userId }).sort({ createdAt: -1 });
};
clientCardSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
clientCardSchema.statics.findBySerialNumber = function (serialNumber) {
    return this.findOne({ serialNumber: serialNumber.toUpperCase() });
};
export const ClientCard = mongoose.model('ClientCard', clientCardSchema);
//# sourceMappingURL=ClientCard.js.map