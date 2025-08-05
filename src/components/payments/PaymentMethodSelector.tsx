
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, Building2 } from "lucide-react";
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import type { PaymentMethod } from '@/hooks/usePaymentMethods';

interface PaymentMethodSelectorProps {
  onSelect: (paymentMethod: PaymentMethod) => void;
  selectedMethodId?: string;
}

export function PaymentMethodSelector({ onSelect, selectedMethodId }: PaymentMethodSelectorProps) {
  const { paymentMethods, loading } = usePaymentMethods();

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'mobile_money': return <Smartphone className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'bank': return <Building2 className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'mtn': return 'bg-yellow-500';
      case 'vodafone': return 'bg-red-500';
      case 'airteltigo': return 'bg-blue-500';
      case 'paystack': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMethodId === method.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(method)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-white ${getMethodColor(method.provider)}`}>
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {method.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                {selectedMethodId === method.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
