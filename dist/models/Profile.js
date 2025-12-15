import mongoose, { Schema } from 'mongoose';
const profileLinkSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { _id: false });
const socialLinkSchema = new Schema({
    platform: { type: String, required: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { _id: false });
const themeSchema = new Schema({
    backgroundColor: { type: String, default: '#0a0a0a' },
    textColor: { type: String, default: '#ffffff' },
    buttonColor: { type: String, default: '#d4af37' },
    linkBlockColor: { type: String },
    buttonTextColor: { type: String, default: '#0a0a0a' },
    buttonStyle: {
        type: String,
        enum: ['rounded', 'square', 'pill'],
        default: 'rounded',
    },
    fontFamily: { type: String, default: 'Inter' },
    nameFontSize: { type: Number },
    bioFontSize: { type: Number },
    linkFontSize: { type: Number },
}, { _id: false });
const profileSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
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
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    avatarUrl: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    links: {
        type: [profileLinkSchema],
        default: [],
    },
    socialLinks: {
        type: [socialLinkSchema],
        default: [],
    },
    theme: {
        type: themeSchema,
        default: () => ({}),
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    templateId: {
        type: String,
        ref: 'Template',
    },
}, {
    timestamps: true,
});
// Static methods
profileSchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug: slug.toLowerCase() });
};
profileSchema.statics.findByUserId = function (userId) {
    return this.findOne({ userId });
};
export const Profile = mongoose.model('Profile', profileSchema);
//# sourceMappingURL=Profile.js.map