import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  title: string;
  message: string;
  userIds?: string[];
  userType?: 'customer' | 'rider' | 'all';
  data?: Record<string, string>;
  url?: string;
}

export const sendPushNotification = async (params: SendNotificationParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: params,
    });

    if (error) {
      console.error('[NotificationService] Error:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error('[NotificationService] Error:', error);
    return { success: false, error: 'Failed to send notification' };
  }
};

// Send notification to specific users
export const notifyUsers = async (
  userIds: string[],
  title: string,
  message: string,
  url?: string
) => {
  return sendPushNotification({ title, message, userIds, url });
};

// Send notification to all customers
export const notifyAllCustomers = async (
  title: string,
  message: string,
  url?: string
) => {
  return sendPushNotification({ title, message, userType: 'customer', url });
};

// Send notification to all riders
export const notifyAllRiders = async (
  title: string,
  message: string,
  url?: string
) => {
  return sendPushNotification({ title, message, userType: 'rider', url });
};

// Send notification to everyone
export const notifyAll = async (
  title: string,
  message: string,
  url?: string
) => {
  return sendPushNotification({ title, message, userType: 'all', url });
};

// Notification types for common events
export const NotificationTemplates = {
  newMessage: (senderName: string, conversationId: string) => ({
    title: `New message from ${senderName}`,
    message: 'You have a new message',
    url: `/conversation/${conversationId}`,
  }),
  
  orderConfirmed: (orderId: string) => ({
    title: 'Order Confirmed',
    message: 'Your order has been confirmed and is being processed',
    url: `/orders/${orderId}`,
  }),
  
  orderShipped: (orderId: string) => ({
    title: 'Order Shipped',
    message: 'Your order is on its way',
    url: `/orders/${orderId}`,
  }),
  
  orderDelivered: (orderId: string) => ({
    title: 'Order Delivered',
    message: 'Your order has been delivered',
    url: `/orders/${orderId}`,
  }),
  
  newOrder: (orderId: string) => ({
    title: 'New Order',
    message: 'You have a new order to fulfill',
    url: `/orders/${orderId}`,
  }),
  
  deliveryAssigned: (orderId: string) => ({
    title: 'New Delivery',
    message: 'You have been assigned a new delivery',
    url: `/deliveries/${orderId}`,
  }),
  
  productSold: (productTitle: string) => ({
    title: 'Item Sold!',
    message: `Your "${productTitle}" has been sold`,
    url: '/dashboard',
  }),
};
