import { FastifyRequest } from 'fastify';

// User roles
export type UserRole = 'user' | 'admin';

// User types
export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Profile/Linktree types
export interface IProfileLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface IProfileSocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

export interface IProfileTheme {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  linkBlockColor?: string;
  buttonTextColor: string;
  buttonStyle: 'rounded' | 'square' | 'pill';
  fontFamily: string;
  nameFontSize?: number;
  bioFontSize?: number;
  linkFontSize?: number;
}

export interface IProfile {
  _id: string;
  userId: string;
  slug: string; // unique URL slug (e.g., nicolas.oliveira)
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  isAdmin?: boolean;
  links: IProfileLink[];
  socialLinks: IProfileSocialLink[];
  theme: IProfileTheme;
  isPublic: boolean;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template types
export interface ITemplate {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  theme: IProfileTheme;
  isActive: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Finance types
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';
export type CardType = 'classic' | 'premium' | 'metal';

export interface IPaymentCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface IBill {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  status: PaymentStatus;
  invoiceUrl?: string;
  paidAt?: Date;
  createdAt: Date;
}

export interface ISubscription {
  _id: string;
  userId: string;
  plan: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPhysicalCard {
  _id: string;
  userId: string;
  type: CardType;
  status: 'ordered' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  orderedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface IUserFinance {
  _id: string;
  userId: string;
  paymentCards: IPaymentCard[];
  subscription?: ISubscription;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Authenticated Request
export interface AuthenticatedRequest extends FastifyRequest {
  user: JWTPayload;
}

// Order types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface IOrder {
  _id: string;
  userId: string;
  customerName: string;
  email: string;
  items: string[];
  total: number;
  status: OrderStatus;
  cardDesign?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Card types
export interface IProductCard {
  _id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  image?: string;
  active: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Client Card types (physical cards)
export type ClientCardStatus = 'ordered' | 'manufacturing' | 'shipped' | 'delivered' | 'activated';

export interface IClientCard {
  _id: string;
  serialNumber: string;
  orderId: string;
  userId?: string;
  customerName: string;
  email: string;
  cardType: string;
  design: string;
  status: ClientCardStatus;
  shippingAddress?: string;
  trackingNumber?: string;
  orderDate: Date;
  deliveryDate?: Date;
  activatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Admin Stats
export interface IAdminStats {
  pendingOrders: number;
  totalRevenue: number;
  activeUsers: number;
  lowStock: number;
}

