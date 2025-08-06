import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface PhoneVerificationStepProps {
  phone: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export const PhoneVerificationStep = ({ phone, onVerificationComplete, onBack }: PhoneVerificationStepProps) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const { toast } = useToast();

  const sendVerificationCode = async () => {
    setSendingCode(true);
    try {
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code in user profile (in real app, send via SMS)
      const { error } = await supabase
        .from('profiles')
        .update({
          phone_verification_code: code,
          phone_verification_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          phone_verification_attempts: 0
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // In a real app, you would send SMS here
      // For demo purposes, show the code in a toast
      toast({
        title: "Verification Code Sent",
        description: `Demo code: ${code} (In production, this would be sent via SMS)`,
        duration: 10000,
      });

      setCodeSent(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not found');

      // Get current verification data
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('phone_verification_code, phone_verification_expires_at, phone_verification_attempts')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Check if code has expired
      if (new Date() > new Date(profile.phone_verification_expires_at)) {
        toast({
          title: "Code Expired",
          description: "Verification code has expired. Please request a new one.",
          variant: "destructive",
        });
        return;
      }

      // Check attempts
      if (profile.phone_verification_attempts >= 3) {
        toast({
          title: "Too Many Attempts",
          description: "Too many failed attempts. Please request a new code.",
          variant: "destructive",
        });
        return;
      }

      // Verify code
      if (verificationCode === profile.phone_verification_code) {
        // Update profile with verified phone
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            phone: phone,
            phone_verified: true,
            phone_verification_code: null,
            phone_verification_expires_at: null,
            phone_verification_attempts: 0
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        toast({
          title: "Phone Verified!",
          description: "Your phone number has been successfully verified.",
        });

        onVerificationComplete();
      } else {
        // Increment attempts
        await supabase
          .from('profiles')
          .update({
            phone_verification_attempts: profile.phone_verification_attempts + 1
          })
          .eq('id', user.id);

        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input value={phone} disabled className="bg-muted" />
        </div>

        {!codeSent ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We'll send a verification code to your phone number to confirm it's valid.
            </p>
            <Button 
              onClick={sendVerificationCode} 
              disabled={sendingCode}
              className="w-full"
            >
              {sendingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            
            <Button 
              onClick={verifyCode} 
              disabled={loading || verificationCode.length !== 6}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verify Code
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={sendVerificationCode} 
              disabled={sendingCode}
              className="w-full"
            >
              Resend Code
            </Button>
          </div>
        )}

        <Button variant="ghost" onClick={onBack} className="w-full">
          Back to Registration
        </Button>
      </CardContent>
    </Card>
  );
};