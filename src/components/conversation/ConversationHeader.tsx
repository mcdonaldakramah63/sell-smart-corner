
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';

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
    <div className="flex items-center mb-6 p-4 bg-white rounded-lg shadow-sm border">
      <Button variant="ghost" size="sm" className="mr-3 hover:bg-slate-100" asChild>
        <Link to="/messages">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Messages
        </Link>
      </Button>
      
      {otherUser && (
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3 ring-2 ring-slate-200">
            {otherUser.avatar ? (
              <AvatarImage src={otherUser.avatar} />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {otherUser.name[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-semibold text-slate-800">{otherUser.name}</span>
        </div>
      )}
    </div>
  );
};
