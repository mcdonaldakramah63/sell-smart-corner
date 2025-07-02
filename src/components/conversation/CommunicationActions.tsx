import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageCircle, Video, Mail, MapPin, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunicationActionsProps {
  otherUser: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    location?: string;
  } | null;
  productTitle: string;
}

export const CommunicationActions = ({ otherUser, productTitle }: CommunicationActionsProps) => {
  const { toast } = useToast();
  const [showContact, setShowContact] = useState(false);

  const handleCall = () => {
    if (otherUser?.phone) {
      window.location.href = `tel:${otherUser.phone}`;
    } else {
      toast({
        title: 'Phone number not available',
        description: 'The seller has not provided their phone number.',
        variant: 'destructive'
      });
    }
  };

  const handleSMS = () => {
    if (otherUser?.phone) {
      const message = encodeURIComponent(`Hi! I'm interested in your listing: ${productTitle}`);
      window.location.href = `sms:${otherUser.phone}?body=${message}`;
    } else {
      toast({
        title: 'Phone number not available',
        description: 'The seller has not provided their phone number.',
        variant: 'destructive'
      });
    }
  };

  const handleEmail = () => {
    if (otherUser?.email) {
      const subject = encodeURIComponent(`Inquiry about: ${productTitle}`);
      const body = encodeURIComponent(`Hi ${otherUser.name},\n\nI'm interested in your listing: ${productTitle}\n\nBest regards`);
      window.location.href = `mailto:${otherUser.email}?subject=${subject}&body=${body}`;
    } else {
      toast({
        title: 'Email not available',
        description: 'The seller has not provided their email address.',
        variant: 'destructive'
      });
    }
  };

  const handleVideoCall = () => {
    toast({
      title: 'Video Call',
      description: 'Video calling feature will be available soon. Use the chat for now!',
    });
  };

  if (!otherUser) return null;

  return (
    <Card className="p-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-blue-500" />
          Communication Options
        </h3>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Safe Trading
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCall}
          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
        >
          <Phone className="h-4 w-4 text-green-600" />
          Call
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSMS}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <MessageCircle className="h-4 w-4 text-blue-600" />
          SMS
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmail}
          className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
        >
          <Mail className="h-4 w-4 text-purple-600" />
          Email
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleVideoCall}
          className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300"
        >
          <Video className="h-4 w-4 text-orange-600" />
          Video
        </Button>
      </div>

      {!showContact && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowContact(true)}
          className="w-full text-sm text-slate-600 hover:text-slate-800"
        >
          View Contact Details
        </Button>
      )}

      {showContact && otherUser && (
        <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-slate-500" />
            <span className="text-slate-600">
              {otherUser.phone || 'Not provided'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-slate-500" />
            <span className="text-slate-600">
              {otherUser.email || 'Not provided'}
            </span>
          </div>
          {otherUser.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-slate-500" />
              <span className="text-slate-600">{otherUser.location}</span>
            </div>
          )}
          
          <div className="flex items-start gap-2 mt-3 p-2 bg-yellow-50 rounded text-xs">
            <Shield className="h-3 w-3 text-yellow-600 mt-0.5 shrink-0" />
            <span className="text-yellow-800">
              <strong>Safety Tip:</strong> Meet in public places for transactions. Never share sensitive information.
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};