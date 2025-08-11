import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductDetailMobileActionsProps {
  price: number;
  disabled?: boolean;
  onBuyNow: () => void;
  onAddToCart?: () => void;
}

export function ProductDetailMobileActions({ price, disabled, onBuyNow, onAddToCart }: ProductDetailMobileActionsProps) {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 supports-[backdrop-filter]:bg-background/70 backdrop-blur-md border-t border-border shadow-elegant safe-area-pb">
      <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-xl font-semibold text-primary truncate">${price.toFixed(2)}</div>
        </div>
        {onAddToCart && (
          <Button variant="outline" className="h-11 px-4" onClick={onAddToCart} disabled={disabled}>
            Add to Cart
          </Button>
        )}
        <Button className="h-11 px-6" onClick={onBuyNow} disabled={disabled}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}

export default ProductDetailMobileActions;
