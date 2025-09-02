
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OnlineStatus } from '@/components/conversation/OnlineStatus';
import { format, isToday, isYesterday } from 'date-fns';
import { MessageSquare, CheckCheck, Star, Shield } from 'lucide-react';

interface ConversationPreview {
  id: string;
  product: {
    id: string;
    title: string;
    image?: string;
  };
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    read: boolean;
    isFromUser: boolean;
  };
}

interface ConversationCardProps {
  conversation: ConversationPreview;
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d');
  }
};

export const ConversationCard = ({ conversation }: ConversationCardProps) => {
  const hasUnreadMessage = conversation.lastMessage && 
    !conversation.lastMessage.read && 
    !conversation.lastMessage.isFromUser;

  return (
    <Link to={`/conversation/${conversation.id}`}>
      <Card className={`hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
        hasUnreadMessage ? 'ring-2 ring-blue-200 bg-blue-50/30' : 'bg-white hover:bg-slate-50/50'
      }`}>
        <div className="p-4">
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={conversation.product.image || '/placeholder.svg'}
                  alt={conversation.product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {hasUnreadMessage && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 line-clamp-1 text-sm">
                    {conversation.product.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Avatar className="h-6 w-6">
                          {conversation.otherUser.avatar ? (
                            <AvatarImage src={conversation.otherUser.avatar} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                              {conversation.otherUser.name[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <OnlineStatus 
                            userId={conversation.otherUser.id} 
                            conversationId={conversation.id}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {conversation.otherUser.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3 text-green-500" />
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-slate-500">4.8</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1 ml-2">
                  {conversation.lastMessage && (
                    <span className="text-xs text-slate-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  )}
                  
                  {hasUnreadMessage && (
                    <Badge variant="default" className="h-5 px-2 text-xs bg-blue-500">
                      New
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Last Message */}
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {conversation.lastMessage ? (
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-3 w-3 text-slate-400 flex-shrink-0" />
                      <p className={`text-sm line-clamp-1 ${
                        hasUnreadMessage 
                          ? 'font-medium text-slate-800' 
                          : 'text-slate-600'
                      }`}>
                        {conversation.lastMessage.isFromUser && (
                          <span className="text-blue-600 mr-1">You:</span>
                        )}
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-3 w-3 text-slate-400" />
                      <p className="text-sm text-slate-500 italic">
                        Start the conversation
                      </p>
                    </div>
                  )}
                </div>
                
                {conversation.lastMessage?.isFromUser && (
                  <CheckCheck className={`h-4 w-4 ml-2 ${
                    conversation.lastMessage.read ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
