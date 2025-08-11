
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
}

interface ConversationHeaderProps {
  otherUser: Participant | null;
}

export const ConversationHeader = ({ otherUser }: ConversationHeaderProps) => {
  return (
    <div className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hover:bg-slate-100" asChild>
            <Link to="/messages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          
          {otherUser && (
            <>
              <div className="relative">
                <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                  {otherUser.avatar ? (
                    <AvatarImage src={otherUser.avatar} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                      {otherUser.name[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <OnlineStatus userId={otherUser.id} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold text-foreground truncate text-sm md:text-base" title={otherUser.name}>{otherUser.name}</h2>
                  <Badge variant="secondary" className="hidden md:inline-flex text-[10px] md:text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                  <div className="flex items-center gap-2">
                    <span className="md:hidden inline-flex"><OnlineStatus userId={otherUser.id} /></span>
                    <span className="hidden md:inline-flex"><OnlineStatus userId={otherUser.id} showText /></span>
                    <span className="text-muted-foreground hidden md:inline">•</span>
                    <div className="hidden md:flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-muted-foreground">4.8</span>
                    </div>
                  </div>
              </div>
            </>
          )}
        </div>
        
        {otherUser && (
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hover:bg-muted">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hover:bg-muted">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
