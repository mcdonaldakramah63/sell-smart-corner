import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Heart, ThumbsUp, ThumbsDown, Smile, AlertCircle } from 'lucide-react';

interface MessageReactionsProps {
  messageId: string;
  reactions?: Record<string, number>;
  onReact: (messageId: string, reaction: string) => void;
}

const reactionEmojis = [
  { emoji: '👍', name: 'thumbsup', icon: ThumbsUp },
  { emoji: '❤️', name: 'heart', icon: Heart },
  { emoji: '😀', name: 'smile', icon: Smile },
  { emoji: '👎', name: 'thumbsdown', icon: ThumbsDown },
  { emoji: '⚠️', name: 'warning', icon: AlertCircle },
];

export const MessageReactions = ({ messageId, reactions = {}, onReact }: MessageReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (reactionName: string) => {
    onReact(messageId, reactionName);
    setShowReactions(false);
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      {/* Show existing reactions */}
      {Object.entries(reactions).map(([reaction, count]) => {
        if (count === 0) return null;
        const reactionData = reactionEmojis.find(r => r.name === reaction);
        return (
          <Button
            key={reaction}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs bg-slate-100 hover:bg-slate-200"
            onClick={() => handleReaction(reaction)}
          >
            {reactionData?.emoji || reaction} {count}
          </Button>
        );
      })}

      {/* Add reaction button */}
      <Popover open={showReactions} onOpenChange={setShowReactions}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-slate-100"
          >
            <Smile className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {reactionEmojis.map((reaction) => (
              <Button
                key={reaction.name}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-100"
                onClick={() => handleReaction(reaction.name)}
                title={reaction.name}
              >
                {reaction.emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};