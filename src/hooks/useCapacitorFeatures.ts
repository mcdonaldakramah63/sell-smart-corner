
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { isCapacitor } from '@/lib/isCapacitor';

// Capacitor imports - these will be undefined if not in Capacitor
declare const Capacitor: any;
declare const Camera: any;
declare const Geolocation: any;
declare const Device: any;
declare const StatusBar: any;
declare const SplashScreen: any;
declare const Share: any;

export const useCapacitorFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [geolocationSupported, setGeolocationSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkCapacitorFeatures = async () => {
      const native = isCapacitor();
      setIsNative(native);

      if (native && typeof Capacitor !== 'undefined') {
        try {
          // Get device information
          if (typeof Device !== 'undefined') {
            const info = await Device.getInfo();
            setDeviceInfo(info);
          }

          // Check camera availability
          if (typeof Camera !== 'undefined') {
            setCameraSupported(true);
          }

          // Check geolocation availability
          if (typeof Geolocation !== 'undefined') {
            setGeolocationSupported(true);
          }

          // Hide splash screen
          if (typeof SplashScreen !== 'undefined') {
            setTimeout(() => {
              SplashScreen.hide();
            }, 3000);
          }

          // Configure status bar
          if (typeof StatusBar !== 'undefined') {
            await StatusBar.setBackgroundColor({ color: '#2563eb' });
            await StatusBar.setStyle({ style: 'LIGHT' });
          }
        } catch (error) {
          console.error('Error initializing Capacitor features:', error);
        }
      }
    };

    checkCapacitorFeatures();
  }, []);

  const takePhoto = async (): Promise<string | null> => {
    if (!isNative || typeof Camera === 'undefined') {
      toast({
        title: 'Camera not available',
        description: 'Camera functionality is only available in the native app.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: Camera.CameraResultType.DataUrl,
        source: Camera.CameraSource.Camera
      });

      return image.dataUrl;
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Camera Error',
        description: 'Failed to take photo. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const selectFromGallery = async (): Promise<string | null> => {
    if (!isNative || typeof Camera === 'undefined') {
      toast({
        title: 'Gallery not available',
        description: 'Gallery functionality is only available in the native app.',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: Camera.CameraResultType.DataUrl,
        source: Camera.CameraSource.Photos
      });

      return image.dataUrl;
    } catch (error) {
      console.error('Gallery error:', error);
      toast({
        title: 'Gallery Error',
        description: 'Failed to select photo. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const getCurrentLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    if (!isNative || typeof Geolocation === 'undefined') {
      // Fallback to web geolocation
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          toast({
            title: 'Location not available',
            description: 'Geolocation is not supported by this browser.',
            variant: 'destructive'
          });
          resolve(null);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            toast({
              title: 'Location Error',
              description: 'Failed to get your location. Please check permissions.',
              variant: 'destructive'
            });
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      });
    }

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Capacitor geolocation error:', error);
      toast({
        title: 'Location Error',
        description: 'Failed to get your location. Please check permissions.',
        variant: 'destructive'
      });
      return null;
    }
  };

  const shareContent = async (title: string, text: string, url?: string): Promise<boolean> => {
    if (!isNative || typeof Share === 'undefined') {
      // Fallback to Web Share API
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return true;
        } catch (error) {
          console.error('Web share error:', error);
        }
      }
      
      // Fallback to copying to clipboard
      if (navigator.clipboard) {
        try {
          const shareText = `${title}\n${text}${url ? `\n${url}` : ''}`;
          await navigator.clipboard.writeText(shareText);
          toast({
            title: 'Copied to clipboard',
            description: 'Share content has been copied to your clipboard.'
          });
          return true;
        } catch (error) {
          console.error('Clipboard error:', error);
        }
      }

      toast({
        title: 'Share not available',
        description: 'Sharing is not supported on this device.',
        variant: 'destructive'
      });
      return false;
    }

    try {
      await Share.share({
        title,
        text,
        url
      });
      return true;
    } catch (error) {
      console.error('Capacitor share error:', error);
      toast({
        title: 'Share Error',
        description: 'Failed to share content. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    isNative,
    deviceInfo,
    cameraSupported,
    geolocationSupported,
    takePhoto,
    selectFromGallery,
    getCurrentLocation,
    shareContent
  };
};
