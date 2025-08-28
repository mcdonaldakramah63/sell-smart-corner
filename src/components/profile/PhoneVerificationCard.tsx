
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
    if (!phone || !user?.id) {
      toast({
        title: 'Error',
        description: 'Please enter a phone number',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsVerifying(true);
      
      // Use the secure database function to generate and store hashed code
      const { error } = await supabase.rpc('generate_phone_verification_code', {
        user_uuid: user.id,
        phone_number: phone
      });

      if (error) throw error;
      
      setCodeSent(true);
      toast({
        title: 'Verification code sent',
        description: 'Please check your phone for the verification code'
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
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
    if (!verificationCode || !user?.id) {
      toast({
        title: 'Error',
        description: 'Please enter the verification code',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsVerifying(true);
      
      // Use the secure database function to verify the code
      const { data: isValid, error } = await supabase.rpc('verify_phone_code', {
        user_uuid: user.id,
        input_code: verificationCode
      });

      if (error) {
        if (error.message.includes('Too many verification attempts')) {
          toast({
            title: 'Too many attempts',
            description: 'Too many failed attempts. Please request a new code.',
            variant: 'destructive'
          });
          setCodeSent(false);
          setVerificationCode('');
          return;
        }
        if (error.message.includes('expired')) {
          toast({
            title: 'Code expired',
            description: 'Verification code has expired. Please request a new one.',
            variant: 'destructive'
          });
          setCodeSent(false);
          setVerificationCode('');
          return;
        }
        throw error;
      }

      if (isValid) {
        // Update the phone number in the profile
        await supabase
          .from('profiles')
          .update({ phone: phone })
          .eq('id', user.id);

        setIsVerified(true);
        toast({
          title: 'Phone verified',
          description: 'Your phone number has been successfully verified'
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: 'Error',
        description: 'Invalid verification code. Please try again.',
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
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
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
