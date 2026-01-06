import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuickRepliesProps {
  onSelect: (text: string) => void;
  suggestions?: string[];
}

export function QuickReplies({ onSelect, suggestions = [
  "Is this available?",
  "What’s your last price?",
  "Can you share location?",
  "When can I pick up?"
] }: QuickRepliesProps) {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <div className="bg-muted/50 border-t border-border/50 px-3 py-2 overflow-x-auto no-scrollbar">
      <div className="flex flex-nowrap gap-2 items-center w-max">
        {suggestions.map((text) => (
          <Button
            key={text}
            variant="outline"
            size="sm"
            className="rounded-full h-10 px-4 whitespace-nowrap text-sm leading-none tap-target"
            onClick={() => onSelect(text)}
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default QuickReplies;
