
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Phone, Shield } from 'lucide-react';

export default function PhoneVerificationCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const sendVerificationCode = async () => {
    if (!phone) {
      toast({
        title: 'Error',
        description: 'Please enter a phone number',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsVerifying(true);
      
      // In a real implementation, you would integrate with SMS service
      // For now, we'll simulate the process
      console.log('Sending verification code to:', phone);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCodeSent(true);
      toast({
        title: 'Verification code sent',
        description: 'Please check your phone for the verification code'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: 'Error',
        description: 'Please enter the verification code',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsVerifying(true);
      
      // In a real implementation, you would verify the code with your SMS service
      // For demo purposes, accept any 4-digit code
      if (verificationCode.length === 4) {
        // Update profile with verified phone number
        const { error } = await supabase
          .from('profiles')
          .update({ 
            phone,
            phone_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id);

        if (error) throw error;

        setIsVerified(true);
        toast({
          title: 'Phone verified',
          description: 'Your phone number has been successfully verified'
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid verification code',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="shadow-lg border-slate-200 bg-white">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-md">
            <Phone className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-slate-800">Phone Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your phone number for enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {!isVerified ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={codeSent}
              />
            </div>

            {!codeSent ? (
              <Button 
                onClick={sendVerificationCode}
                disabled={isVerifying || !phone}
                className="w-full"
              >
                {isVerifying ? 'Sending...' : 'Send Verification Code'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 4-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={verifyCode}
                    disabled={isVerifying || !verificationCode}
                    className="flex-1"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Code'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCodeSent(false);
                      setVerificationCode('');
                    }}
                  >
                    Change Number
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-green-500 rounded-md">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-green-800">Phone Verified</p>
                <p className="text-sm text-green-600">{phone}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
