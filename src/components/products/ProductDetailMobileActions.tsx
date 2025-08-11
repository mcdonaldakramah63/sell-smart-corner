import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Phone, MessageCircle } from "lucide-react";

interface ProductDetailMobileActionsProps {
  phone?: string | null;
  disabled?: boolean;
  onCall: () => void;
  onMessage: () => void;
}

export function ProductDetailMobileActions({ phone, disabled, onCall, onMessage }: ProductDetailMobileActionsProps) {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-14 left-0 right-0 z-60 bg-background/95 supports-[backdrop-filter]:bg-background/70 backdrop-blur-md border-t border-border shadow-elegant safe-area-pb">
      <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center gap-3">
        <Button
          variant="outline"
          className="h-11 px-5 flex-1"
          onClick={onCall}
          disabled={disabled || !phone}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
        <Button className="h-11 px-6 flex-1" onClick={onMessage} disabled={disabled}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
      </div>
    </div>
  );
}

export default ProductDetailMobileActions;
