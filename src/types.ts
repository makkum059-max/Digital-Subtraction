export type CategoryId = 'all' | 'dinajpur' | 'rajshahi' | 'premium' | 'bombay' | 'bedana' | 'china3' | 'gift-pack';

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1 to 5 stars
  comment: string;
  date: string;
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  code?: string; // Product Code / SKU e.g. "LIC-101"
  name: string;
  nameBn: string;
  category: string; // matches category id or name
  price: number;
  costPrice?: number; // Purchase / Cost Price (ক্রয় মূল্য) e.g. 310
  originalPrice?: number;
  unit: string; // e.g., '১০০ পিস', '১০০০ পিস', '১ কেজি'
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isHotProduct?: boolean; // 🔥 Hot Product flag
  hotTagText?: string; // e.g. "হট অফার 🔥", "বাম্পার সেল ⚡"
  description: string;
  origin: string; // e.g., 'দিনাজপুর', 'রাজশাহী'
  validity?: string; // Product validity e.g. "গাছ থেকে কাটার পর ৭-১০ দিন শতভাগ তাজা থাকে"
  validityOptions?: string[]; // e.g., ['1 Month', '3 Month', '6 Month']
  validityPricing?: Record<string, number>; // Custom pricing per validity option e.g. { '1 Month': 450, '3 Month': 1200, '6 Month': 2200 }
  subscriptionTypes?: string[]; // e.g., ['Personal', 'Share', 'Individual']
  subscriptionPricing?: Record<string, number>; // Custom pricing per subscription type e.g. { 'Personal': 0, 'Share': -100 }
  details?: string[]; // Bullet details or specifications
  reviews?: ProductReview[]; // Customer reviews
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  description: string;
  isActive: boolean;
  usageCount?: number;
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  iconName?: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedUnit?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
}

export interface Order {
  id: string; // e.g. "ORD-8492"
  invoice_id?: string; // e.g. "INV-849201" or ZiniPay / Gateway Invoice ID
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  district: string;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka' | 'express';
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  appliedPromoCode?: string;
  totalAmount: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'online' | 'zinipay';
  paymentTrxId?: string;
  invoiceStatus?: string; // e.g. "true" | "completed" | "pending"
  ziniPayUrl?: string;
  status: OrderStatus;
  orderDate: string; // ISO string or human date
  notes?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  bgGradient: string;
  buttonText: string;
  buttonLinkCategory?: string;
  isActive: boolean;
}

export interface CustomPaymentMethod {
  id: string;
  name: string; // e.g. bKash, Nagad, Rocket, Bank Transfer, Upay
  accountType: string; // 'Personal' | 'Agent' | 'Merchant' | 'Bank'
  accountNumber: string;
  logoImage?: string;
  qrCodeImage?: string;
  instructions?: string;
  isActive: boolean;
}

export type SocialPlatform = 
  | 'facebook'
  | 'whatsapp'
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'messenger'
  | 'twitter'
  | 'telegram'
  | 'linkedin'
  | 'pinterest'
  | 'spotify'
  | 'snapchat'
  | 'behance'
  | 'amazon'
  | 'email'
  | 'dribbble'
  | 'phone'
  | 'skype'
  | 'threads'
  | 'wechat'
  | 'custom';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  title: string;
  url: string;
  icon?: string;
  isActive: boolean;
}

export type ThemePreset = 'red' | 'emerald' | 'purple' | 'amber' | 'blue' | 'rose' | 'teal' | 'maroon' | 'custom';

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  logoText: string;
  siteLogoImage?: string; // Uploaded/Custom Logo image URL
  announcementText: string;
  phonePrimary: string;
  phoneWhatsapp: string;
  bkashNumber: string;
  nagadNumber: string;
  deliveryFeeInsideDhaka: number;
  deliveryFeeOutsideDhaka: number;
  deliveryFeeExpress: number;
  addressText: string;
  emailText: string;
  facebookUrl?: string;
  sslEnabled?: boolean;
  sslServiceUrl?: string; // SSLCommerz / SSL Gateway Service Link
  sslSealImage?: string;
  weAcceptLogoImage?: string; // Custom "We Accept" payment banner/logo image (Upload & Remove)
  customPaymentMethods?: CustomPaymentMethod[];
  socialLinks?: SocialLink[];
  adminEmail: string; // Configurable admin email (e.g. admin@litchibag.com)
  adminPin: string; // Configurable admin password / pin
  onlinePaymentUrl?: string; // Online Service Payment Gateway URL
  onlinePaymentTitle?: string; // Title for online payment method
  primaryTheme?: ThemePreset;
  customHexColor?: string;

  // Custom Trust Section Settings (Editable from Admin)
  whyChooseBadge?: string;
  whyChooseTitle?: string;
  whyChooseSubtitle?: string;
  testimonial1Text?: string;
  testimonial1Author?: string;
  testimonial2Text?: string;
  testimonial2Author?: string;
  testimonial3Text?: string;
  testimonial3Author?: string;

  // Hero 4 Feature Cards Settings (Editable from Admin)
  feature1Title?: string;
  feature1Subtitle?: string;
  feature2Title?: string;
  feature2Subtitle?: string;
  feature3Title?: string;
  feature3Subtitle?: string;
  feature4Title?: string;
  feature4Subtitle?: string;

  // ZiniPay Payment Gateway Settings
  ziniPayApiKey?: string;
  ziniPayEndpoint?: string;
  ziniPayVerifyEndpoint?: string;
  ziniPayRedirectUrl?: string;
  ziniPayCancelUrl?: string;
  ziniPayWebhookUrl?: string;
  ziniPayEnabled?: boolean;
}

export type AdminTab = 'overview' | 'products' | 'categories' | 'orders' | 'promos' | 'banners' | 'reviews' | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  photoURL?: string;
  lastLoginAt?: string;
}
