
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

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

export const ConversationCard = ({ conversation }: ConversationCardProps) => {
  return (
    <Link to={`/conversation/${conversation.id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border-slate-200 hover:border-blue-200">
        <div className="p-6 flex gap-4">
          {/* Product image */}
          <div className="hidden sm:block w-16 h-16 relative rounded-lg overflow-hidden shrink-0 shadow-sm">
            <img
              src={conversation.product.image || '/placeholder.svg'}
              alt={conversation.product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Message preview */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold line-clamp-1 flex-1 text-slate-800">
                {conversation.product.title}
              </h3>
              
              {conversation.lastMessage && (
                <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                  {format(new Date(conversation.lastMessage.timestamp), 'MMM d, h:mm a')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                {conversation.otherUser.avatar ? (
                  <AvatarImage src={conversation.otherUser.avatar} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {conversation.otherUser.name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium text-slate-700 line-clamp-1">
                {conversation.otherUser.name}
              </span>
            </div>
            
            {conversation.lastMessage ? (
              <p className={`text-sm mt-3 line-clamp-2 ${
                !conversation.lastMessage.read && !conversation.lastMessage.isFromUser 
                  ? 'font-medium text-slate-800' 
                  : 'text-slate-600'
              }`}>
                {conversation.lastMessage.isFromUser ? (
                  <span className="text-blue-600 font-medium">You: </span>
                ) : null}
                {conversation.lastMessage.content}
              </p>
            ) : (
              <p className="text-sm mt-3 text-slate-500 italic">
                No messages yet - start the conversation
              </p>
            )}
            
            {conversation.lastMessage && !conversation.lastMessage.read && !conversation.lastMessage.isFromUser && (
              <Badge variant="default" className="mt-3 bg-gradient-to-r from-blue-500 to-blue-600">
                New message
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
