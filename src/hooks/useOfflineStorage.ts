
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  id: string;
  data: any;
  timestamp: number;
  type: 'product' | 'message' | 'profile';
}

export const useOfflineStorage = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [storageSize, setStorageSize] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'indexedDB' in window && 'serviceWorker' in navigator;
      setIsSupported(supported);
      
      if (supported) {
        estimateStorage();
      }
    };

    checkSupport();
  }, []);

  const estimateStorage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        setStorageSize(estimate.usage || 0);
      } catch (error) {
        console.error('Storage estimation failed:', error);
      }
    }
  };

  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('UsedMarketOffline', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        // Create object stores
        const stores = ['products', 'messages', 'profiles'];
        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp');
            store.createIndex('type', 'type');
          }
        });
      };
    });
  }, []);

  const saveOfflineData = useCallback(async (
    storeName: string,
    id: string,
    data: any,
    type: OfflineData['type']
  ): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const db = await openDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const offlineData: OfflineData = {
        id,
        data,
        type,
        timestamp: Date.now()
      };
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(offlineData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Register for background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(`background-sync-${storeName}`);
      }

      toast({
        title: 'Saved Offline',
        description: 'Your data has been saved and will sync when you\'re back online.',
      });

      return true;
    } catch (error) {
      console.error('Failed to save offline data:', error);
      return false;
    }
  }, [isSupported, openDB, toast]);

  const getOfflineData = useCallback(async (storeName: string): Promise<OfflineData[]> => {
    if (!isSupported) return [];

    try {
      const db = await openDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return [];
    }
  }, [isSupported, openDB]);

  const removeOfflineData = useCallback(async (storeName: string, id: string): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const db = await openDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('Failed to remove offline data:', error);
      return false;
    }
  }, [isSupported, openDB]);

  const clearOfflineData = useCallback(async (storeName?: string): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const db = await openDB();
      const storeNames = storeName ? [storeName] : ['products', 'messages', 'profiles'];
      
      for (const store of storeNames) {
        const transaction = db.transaction([store], 'readwrite');
        const objectStore = transaction.objectStore(store);
        
        await new Promise<void>((resolve, reject) => {
          const request = objectStore.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      toast({
        title: 'Offline Data Cleared',
        description: 'All offline data has been removed.',
      });

      return true;
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      return false;
    }
  }, [isSupported, openDB, toast]);

  return {
    isSupported,
    storageSize,
    saveOfflineData,
    getOfflineData,
    removeOfflineData,
    clearOfflineData,
    estimateStorage
  };
};
