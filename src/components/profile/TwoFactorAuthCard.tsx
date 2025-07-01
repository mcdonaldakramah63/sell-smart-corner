
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Smartphone, Copy } from 'lucide-react';

export default function TwoFactorAuthCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<'disabled' | 'setup' | 'verify' | 'enabled'>('disabled');
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const enable2FA = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would generate a proper TOTP secret
      // and QR code using a library like 'speakeasy' and 'qrcode'
      const mockSecret = 'JBSWY3DPEHPK3PXP';
      const mockQrCode = `otpauth://totp/YourApp:${user?.email}?secret=${mockSecret}&issuer=YourApp`;
      
      setSecretKey(mockSecret);
      setQrCode(mockQrCode);
      setSetupStep('setup');
      
      toast({
        title: '2FA Setup',
        description: 'Scan the QR code with your authenticator app'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to setup 2FA',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit verification code',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real implementation, you would verify the TOTP code
      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        setIs2FAEnabled(true);
        setSetupStep('enabled');
        
        toast({
          title: '2FA Enabled',
          description: 'Two-factor authentication has been successfully enabled'
        });
      } else {
        throw new Error('Invalid code');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid verification code',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would disable 2FA in your backend
      setIs2FAEnabled(false);
      setSetupStep('disabled');
      setVerificationCode('');
      
      toast({
        title: '2FA Disabled',
        description: 'Two-factor authentication has been disabled'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disable 2FA',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    toast({
      title: 'Copied',
      description: 'Secret key copied to clipboard'
    });
  };

  return (
    <Card className="shadow-lg border-slate-200 bg-white">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-slate-800">Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {setupStep === 'disabled' && (
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-800">Enable 2FA</p>
              <p className="text-sm text-slate-600">
                Secure your account with two-factor authentication
              </p>
            </div>
            <Button onClick={enable2FA} disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Enable 2FA'}
            </Button>
          </div>
        )}

        {setupStep === 'setup' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Setup Instructions</h4>
              <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
                <li>Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Scan the QR code below or enter the secret key manually</li>
                <li>Enter the 6-digit code from your app to verify</li>
              </ol>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center p-8 bg-white border-2 border-dashed border-slate-200 rounded-lg">
                <div className="text-center">
                  <Smartphone className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">QR Code would appear here</p>
                  <p className="text-xs text-slate-500">In a real app, use a QR code library</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secret Key (Manual entry)</Label>
                <div className="flex space-x-2">
                  <Input value={secretKey} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={copySecret}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verify-code">Verification Code</Label>
                <Input
                  id="verify-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={verify2FA} disabled={isLoading} className="flex-1">
                  {isLoading ? 'Verifying...' : 'Verify & Enable'}
                </Button>
                <Button variant="outline" onClick={() => setSetupStep('disabled')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {setupStep === 'enabled' && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-green-500 rounded-md">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-800">2FA Enabled</p>
                <p className="text-sm text-green-600">
                  Your account is protected with two-factor authentication
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">Active</Badge>
              <Button variant="outline" size="sm" onClick={disable2FA}>
                Disable
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
