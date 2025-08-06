
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

export interface ProductQRCode {
  id: string;
  product_id: string;
  qr_code_data: string;
  qr_image_url?: string;
  scan_count: number;
  created_at: string;
}

export const useQRCode = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async (productId: string, productUrl: string) => {
    setLoading(true);
    try {
      // Generate QR code data URL
      const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Save to database
      const { data, error } = await supabase
        .from('product_qr_codes')
        .upsert({
          product_id: productId,
          qr_code_data: productUrl,
          qr_image_url: qrCodeDataUrl
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'QR Code generated',
        description: 'QR code has been generated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'QR Code generation failed',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getQRCode = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_qr_codes')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching QR code:', error);
      return null;
    }
  };

  const incrementScanCount = async (productId: string) => {
    try {
      // Get current scan count and increment by 1
      const { data: currentQR } = await supabase
        .from('product_qr_codes')
        .select('scan_count')
        .eq('product_id', productId)
        .single();

      if (currentQR) {
        await supabase
          .from('product_qr_codes')
          .update({ scan_count: (currentQR.scan_count || 0) + 1 })
          .eq('product_id', productId);
      }
    } catch (error) {
      console.error('Error incrementing scan count:', error);
    }
  };

  return {
    generateQRCode,
    getQRCode,
    incrementScanCount,
    loading
  };
};
