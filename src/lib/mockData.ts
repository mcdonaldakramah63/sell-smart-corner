
import { User, Product, Category, Message, Notification } from './types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'laptop',
  },
  {
    id: '2',
    name: 'Furniture',
    slug: 'furniture',
    icon: 'armchair',
  },
  {
    id: '3',
    name: 'Clothing',
    slug: 'clothing',
    icon: 'shirt',
  },
  {
    id: '4',
    name: 'Books',
    slug: 'books',
    icon: 'book',
  },
  {
    id: '5',
    name: 'Sports',
    slug: 'sports',
    icon: 'dumbbell',
  },
  {
    id: '6',
    name: 'Toys',
    slug: 'toys',
    icon: 'gamepad',
  },
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
    title: 'MacBook Pro 16-inch',
    description: 'Powerful laptop with M1 Pro chip, 16GB RAM, 512GB SSD, Space Gray.',
    price: 1999.99,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000',
    ],
    category: 'Electronics',
    condition: 'like-new',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-05-10T08:12:00Z',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    title: 'Modern Coffee Table',
    description: 'Mid-century modern coffee table with walnut finish and tempered glass top.',
    price: 249.99,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000',
      'https://images.unsplash.com/photo-1565791380713-1756b9a05343?q=80&w=1000',
    ],
    category: 'Furniture',
    condition: 'good',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-04-25T15:30:00Z',
    location: 'Portland, OR',
  },
  {
    id: '3',
    title: 'Canon EOS R5 Camera',
    description: '45MP full-frame mirrorless camera, 8K video, in-body image stabilization, with 24-105mm lens.',
    price: 3899.99,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000',
    ],
    category: 'Electronics',
    condition: 'new',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-05-05T10:45:00Z',
    location: 'Los Angeles, CA',
  },
  {
    id: '4',
    title: 'Leather Jacket',
    description: 'Genuine leather jacket, black, size M, barely worn.',
    price: 175.00,
    images: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1000',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000',
    ],
    category: 'Clothing',
    condition: 'like-new',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-04-30T16:20:00Z',
    location: 'Chicago, IL',
  },
  {
    id: '5',
    title: 'Vintage Vinyl Records Collection',
    description: '50 classic rock and jazz vinyl records from the 60s and 70s, excellent condition.',
    price: 450.00,
    images: [
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=1000',
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1000',
    ],
    category: 'Books',
    condition: 'good',
    seller: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    createdAt: '2023-04-20T09:15:00Z',
    location: 'Austin, TX',
  },
  {
    id: '6',
    title: 'Mountain Bike',
    description: 'Trek Marlin 7, 29" wheels, hydraulic disc brakes, front suspension, size M/L.',
    price: 699.99,
    images: [
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=1000',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000',
    ],
    category: 'Sports',
    condition: 'good',
    seller: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    createdAt: '2023-05-01T13:40:00Z',
    location: 'Denver, CO',
  },
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
