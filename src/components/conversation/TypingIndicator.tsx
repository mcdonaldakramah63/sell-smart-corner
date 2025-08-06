
import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  userName?: string;
}

export const TypingIndicator = ({ isTyping, userName }: TypingIndicatorProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isTyping) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isTyping]);

  if (!isTyping) return null;

  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] flex space-x-2">
        <div className="flex-shrink-0">
          <div className="h-8 w-8" />
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-slate-500">{userName || 'Someone'} is typing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
