import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface IncomingCallModalProps {
  isOpen: boolean;
  callerName: string;
  callerAvatar?: string;
  callType: 'voice' | 'video';
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingCallModal = ({
  isOpen,
  callerName,
  callerAvatar,
  callType,
  onAccept,
  onReject
}: IncomingCallModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onReject()}>
      <DialogContent className="sm:max-w-sm p-6 bg-gradient-to-b from-slate-900 to-slate-800 border-none text-center">
        <VisuallyHidden>
          <DialogTitle>Incoming {callType === 'video' ? 'Video' : 'Voice'} Call</DialogTitle>
        </VisuallyHidden>
        
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-green-500/50 animate-pulse">
              {callerAvatar ? (
                <AvatarImage src={callerAvatar} />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl">
                  {callerName[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
              {callType === 'video' ? (
                <Video className="h-4 w-4 text-white" />
              ) : (
                <Phone className="h-4 w-4 text-white" />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">{callerName}</h3>
            <p className="text-slate-400 mt-1">
              Incoming {callType === 'video' ? 'video' : 'voice'} call...
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
              onClick={onReject}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
              onClick={onAccept}
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
