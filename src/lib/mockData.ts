import { User, Product, Category, Message, Notification } from './types';

// New categories (& matching database slugs/icons)
export const categories: Category[] = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    slug: 'vehicles',
    icon: 'car'
  },
  {
    id: 'property',
    name: 'Property',
    slug: 'property',
    icon: 'home'
  },
  {
    id: 'mobile-phones-tablets',
    name: 'Mobile Phones & Tablets',
    slug: 'mobile-phones-tablets',
    icon: 'mobile'
  },
  {
    id: 'computers',
    name: 'Computers',
    slug: 'computers',
    icon: 'mobile'
  },
  {
    id: 'computer-accessories',
    name: 'Computer Accessories',
    slug: 'computer-accessories',
    icon: 'mobile'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    icon: 'home'
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty and Personal Care',
    slug: 'beauty-personal-care',
    icon: 'home'
  },
  {
    id: 'home-furniture-appliances',
    name: 'Home Furniture & Appliances',
    slug: 'home-furniture-appliances',
    icon: 'home'
  },
  {
    id: 'console',
    name: 'Console',
    slug: 'console',
    icon: 'car'
  },
  {
    id: 'console-accessories',
    name: 'Console Accessories',
    slug: 'console-accessories',
    icon: 'car'
  }
];

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15T09:24:00Z',
    role: 'user',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    createdAt: '2023-02-20T14:30:00Z',
    role: 'user',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@marketplace.com',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    createdAt: '2022-12-01T00:00:00Z',
    role: 'admin',
  },
];

export const products: Product[] = [
  {
    id: '1',
    title: 'Toyota Corolla 2015',
    description: 'A well-maintained used car, low mileage and full service history.',
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1000',
    ],
    category: 'vehicles',
    condition: 'good',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-06-10T11:00:00Z',
    location: 'San Diego, CA',
  },
  {
    id: '2',
    title: 'Downtown Apartment for Rent',
    description: '2 bedroom apartment, close to all amenities, available now.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1000',
    ],
    category: 'property',
    condition: 'good',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-06-12T14:30:00Z',
    location: 'Portland, OR',
  },
  {
    id: '3',
    title: 'iPhone 14 Pro',
    description: 'Latest model, unlocked, like new with all accessories.',
    price: 899.99,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000',
    ],
    category: 'mobile-phones-tablets',
    condition: 'like-new',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-06-11T10:45:00Z',
    location: 'Los Angeles, CA',
  },
  {
    id: '4',
    title: 'Gaming Laptop Asus ROG',
    description: 'RTX 3070, 32GB RAM, 1TB SSD, perfect condition.',
    price: 1500.00,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000',
    ],
    category: 'computers',
    condition: 'good',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-06-13T16:20:00Z',
    location: 'Chicago, IL',
  },
  {
    id: '5',
    title: 'Wireless Mouse Logitech MX Master',
    description: 'High precision, ergonomic design, new in box.',
    price: 85.00,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
    ],
    category: 'computer-accessories',
    condition: 'new',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-06-14T09:15:00Z',
    location: 'Austin, TX',
  },
  {
    id: '6',
    title: 'Designer Dress - Gucci',
    description: 'Original, size M, worn once.',
    price: 650.00,
    images: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1000',
    ],
    category: 'fashion',
    condition: 'like-new',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-06-11T13:40:00Z',
    location: 'Denver, CO',
  },
  {
    id: '7',
    title: 'Organic Face Cream',
    description: 'Beauty and personal care, unopened jar.',
    price: 35.00,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000',
    ],
    category: 'beauty-personal-care',
    condition: 'new',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-06-10T08:12:00Z',
    location: 'San Francisco, CA',
  },
  {
    id: '8',
    title: 'Sofa Set - 3 Pieces',
    description: 'Home furniture, clean and modern, smoke-free home.',
    price: 499,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000',
    ],
    category: 'home-furniture-appliances',
    condition: 'good',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-06-09T15:30:00Z',
    location: 'Portland, OR',
  },
  {
    id: '9',
    title: 'PlayStation 5 Console',
    description: 'Next-gen gaming, includes 2 controllers.',
    price: 700,
    images: [
      'https://images.unsplash.com/photo-1622466684088-3070c60f6a94?q=80&w=1000',
    ],
    category: 'console',
    condition: 'like-new',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-06-07T08:12:00Z',
    location: 'Seattle, WA',
  },
  {
    id: '10',
    title: 'PS5 DualSense Charging Station',
    description: 'For PlayStation 5 controllers, new in box.',
    price: 40,
    images: [
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000',
    ],
    category: 'console-accessories',
    condition: 'new',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-06-08T09:15:00Z',
    location: 'Austin, TX',
  }
];

export const messages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'Hi, is the coffee table still available?',
    createdAt: '2023-05-11T10:05:00Z',
    read: true,
    productId: '2'
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    content: 'Yes, it is! Are you interested in seeing it?',
    createdAt: '2023-05-11T10:15:00Z',
    read: true,
    productId: '2'
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    content: 'Would you be willing to go down to $220?',
    createdAt: '2023-05-11T10:20:00Z',
    read: true,
    productId: '2'
  },
  {
    id: '4',
    senderId: '2',
    receiverId: '1',
    content: "I can do $235, that's the lowest I can go.",
    createdAt: '2023-05-11T10:25:00Z',
    read: false,
    productId: '2'
  },
];

export const notifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'message',
    content: 'Jane Smith sent you a message about Modern Coffee Table',
    createdAt: '2023-05-11T10:15:00Z',
    read: false,
    actionUrl: '/messages/2'
  },
  {
    id: '2',
    userId: '2',
    type: 'message',
    content: 'John Doe sent you a message about Modern Coffee Table',
    createdAt: '2023-05-11T10:05:00Z',
    read: true,
    actionUrl: '/messages/1'
  },
  {
    id: '3',
    userId: '1',
    type: 'system',
    content: 'Welcome to Marketplace! Complete your profile to start selling.',
    createdAt: '2023-01-15T09:30:00Z',
    read: true,
    actionUrl: '/profile'
  },
];
