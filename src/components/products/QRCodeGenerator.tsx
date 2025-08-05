
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Download, Copy, Share2 } from 'lucide-react';
import { useQRCode } from '@/hooks/useQRCode';
import { useSocialSharing } from '@/hooks/useSocialSharing';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  productId: string;
  productTitle: string;
  productUrl: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  productId,
  productTitle,
  productUrl
}) => {
  const [qrData, setQrData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { generateQRCode, getQRCode, loading } = useQRCode();
  const { shareContent } = useSocialSharing();
  const { toast } = useToast();

  useEffect(() => {
    loadQRCode();
  }, [productId]);

  const loadQRCode = async () => {
    const existingQR = await getQRCode(productId);
    if (existingQR) {
      setQrData(existingQR);
    }
  };

  const handleGenerateQR = async () => {
    const result = await generateQRCode(productId, productUrl);
    if (result) {
      setQrData(result);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${productTitle}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      toast({
        title: 'URL copied',
        description: 'Product URL has been copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (platform: 'whatsapp' | 'telegram' | 'email') => {
    shareContent(
      platform,
      productUrl,
      productTitle,
      `Check out this product: ${productTitle}`,
      productId
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {productTitle}</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6">
            {qrData ? (
              <div className="space-y-4">
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCode
                    id="qr-code-svg"
                    value={qrData.qr_code_data}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  Scanned {qrData.scan_count} times
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}>
                    <Share2 className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-muted-foreground">
                  No QR code generated yet
                </div>
                <Button onClick={handleGenerateQR} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
