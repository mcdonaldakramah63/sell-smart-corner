
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Phone, Video, MoreVertical, Shield, Star } from 'lucide-react';
import { OnlineStatus } from '@/components/conversation/OnlineStatus';
import { Badge } from '@/components/ui/badge';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
}

interface ConversationHeaderProps {
  otherUser: Participant | null;
  conversationId?: string;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}

export const ConversationHeader = ({ 
  otherUser, 
  conversationId,
  onVoiceCall,
  onVideoCall
}: ConversationHeaderProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full hover:bg-muted/80 transition-colors"
            asChild
          >
            <Link to="/messages">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          
          {otherUser && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 md:h-11 md:w-11 ring-2 ring-primary/10 shadow-md">
                  {otherUser.avatar ? (
                    <AvatarImage src={otherUser.avatar} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold text-base">
                      {otherUser.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <OnlineStatus userId={otherUser.id} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-foreground truncate text-sm md:text-base" title={otherUser.name}>
                    {otherUser.name}
                  </h2>
                  <Badge variant="secondary" className="hidden md:inline-flex text-[10px] px-1.5 py-0 h-5 bg-emerald-500/10 text-emerald-600 border-0">
                    <Shield className="h-2.5 w-2.5 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="md:hidden">
                    <OnlineStatus userId={otherUser.id} conversationId={conversationId} />
                  </span>
                  <span className="hidden md:flex items-center">
                    <OnlineStatus userId={otherUser.id} conversationId={conversationId} showText />
                  </span>
                  <span className="hidden md:inline text-muted-foreground/50">•</span>
                  <div className="hidden md:flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span className="text-muted-foreground">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {otherUser && (
          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-emerald-500/10 hover:text-emerald-600 transition-all"
              onClick={onVoiceCall}
              title="Voice Call"
            >
              <Phone className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
              onClick={onVideoCall}
              title="Video Call"
            >
              <Video className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-muted/80 transition-all"
            >
              <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
