
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  seller: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  location: string;
  is_sold?: boolean;
  premiumAdType?: 'featured' | 'bump' | 'vip' | 'spotlight';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
  productId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'sale' | 'purchase' | 'system';
  content: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
};
