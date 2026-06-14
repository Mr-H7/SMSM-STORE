export type Locale = "ar" | "en";

export type Product = {
  id: string;
  sku?: string;
  model: string;
  brand: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  descriptionAr: string;
  descriptionEn: string;
  qualityGrade?: string;
  price: number;
  oldPrice?: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  status: "active" | "inactive" | "out-of-stock";
  badge?: string;
  featured: boolean;
  onOffer: boolean;
  images: string[];
  isActive: boolean;
  bestSeller?: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  image: string;
  productCount: number;
  isActive: boolean;
};

export type MessageStatus = "unread" | "read" | "archived";

export type CustomerMessage = {
  id: string;
  name: string;
  contact: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

export type Review = {
  id: string;
  nameAr: string;
  nameEn: string;
  textAr: string;
  textEn: string;
  rating: number;
  cityAr: string;
  cityEn: string;
};

export type OrderStatus =
  | "new"
  | "contacted"
  | "processing"
  | "completed"
  | "cancelled";

export type OrderItem = {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  logo?: string;
  whatsappNumber: string;
  addressAr: string;
  addressEn: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
};
