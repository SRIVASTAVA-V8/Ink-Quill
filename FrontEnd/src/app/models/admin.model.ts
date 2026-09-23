export type AdminRole = 'user' | 'admin';

export interface AdminDashboardSummary {
  userCount: number;
  adminCount: number;
  orderCount: number;
  totalRevenue: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  address?: any;
}

export interface AdminBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  stock: number;
  category: string;
  language?: string;
  publishedDate?: string | Date;
  image?: string[];
  ISBN?: string;
  description?: string;
  discount?: number;
}

export interface AdminOrder {
  _id: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  } | string;
  items?: Array<{
    bookId?: any;
    quantity?: number;
    price?: number;
    title?: string;
  }>;
  orderStatus?: string;
  totalAmount?: number;
  pricing?: {
    total?: number;
    subtotal?: number;
  };
  paymentInfo?: {
    method?: string;
    status?: string;
  };
  shippingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string | Date;
  };
  createdAt?: string | Date;
}

export interface AdminInventoryResponse {
  books: AdminBook[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminBookSearchFilters {
  title?: string;
  author?: string;
  category?: string;
  language?: string;
  minPrice?: number;
  maxPrice?: number;
  isbn?: string;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 1 | -1;
  page?: number;
  limit?: number;
}
