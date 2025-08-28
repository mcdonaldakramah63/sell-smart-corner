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
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please complete email verification first before verifying your phone number.",
          variant: "destructive",
        });
        onBack(); // Go back to registration
        return;
      }

      // Use the secure database function to generate and store hashed code
      const { error } = await supabase.rpc('generate_phone_verification_code', {
        user_uuid: user.id,
        phone_number: phone
      });

      if (error) throw error;

      setCodeSent(true);
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the verification code.",
      });
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

      // Use the secure database function to verify the code
      const { data: isValid, error } = await supabase.rpc('verify_phone_code', {
        user_uuid: user.id,
        input_code: verificationCode
      });

      if (error) {
        // Handle specific error messages from the function
        if (error.message.includes('Too many verification attempts')) {
          toast({
            title: "Too Many Attempts",
            description: "Too many failed attempts. Please request a new code.",
            variant: "destructive",
          });
          setCodeSent(false);
          setVerificationCode('');
          return;
        }
        if (error.message.includes('expired')) {
          toast({
            title: "Code Expired",
            description: "Verification code has expired. Please request a new one.",
            variant: "destructive",
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

        toast({
          title: "Phone Verified!",
          description: "Your phone number has been successfully verified.",
        });

        onVerificationComplete();
      } else {
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