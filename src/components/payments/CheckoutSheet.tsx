import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PaymentMethodSelector } from "@/components/payments/PaymentMethodSelector";
import type { PaymentMethod } from "@/hooks/usePaymentMethods";

interface CheckoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: { title: string; price: number; image?: string };
  onConfirm?: (data: { quantity: number; paymentMethod?: PaymentMethod }) => void;
}

export function CheckoutSheet({ open, onOpenChange, product, onConfirm }: CheckoutSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>(undefined);

  const total = (product.price * quantity).toFixed(2);

  const handleConfirm = () => {
    onConfirm?.({ quantity, paymentMethod: selectedMethod });
    onOpenChange(false);
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(99, q + 1));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Checkout</SheetTitle>
          <SheetDescription className="text-left">Review and confirm your purchase</SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Product Summary */}
          <div className="flex items-center gap-3">
            {product.image ? (
              <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover" loading="lazy" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-muted" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.title}</p>
              <p className="text-sm text-muted-foreground">${product.price.toFixed(2)} each</p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-11 w-11" onClick={decrement} aria-label="Decrease quantity">-</Button>
              <Input
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setQuantity(Math.min(99, Math.max(1, v)));
                }}
                className="w-16 text-center h-11"
                inputMode="numeric"
                aria-label="Quantity"
              />
              <Button variant="outline" size="icon" className="h-11 w-11" onClick={increment} aria-label="Increase quantity">+</Button>
            </div>
          </div>

          <Separator />

          {/* Payment Methods */}
          <PaymentMethodSelector onSelect={setSelectedMethod} selectedMethodId={selectedMethod?.id} />

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Fees</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-4">
          <Button className="w-full h-12" onClick={handleConfirm} disabled={!selectedMethod}>
            Confirm and Pay ${total}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CheckoutSheet;
