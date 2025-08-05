
import React from 'react';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const CurrencySwitcher: React.FC = () => {
  const { currentCurrency, supportedCurrencies, changeCurrency } = useCurrency();

  const currentCurr = supportedCurrencies.find(curr => curr.code === currentCurrency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">{currentCurr?.flag}</span>
          <span className="hidden md:inline">{currentCurr?.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedCurrencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => changeCurrency(currency.code)}
            className={`cursor-pointer ${
              currentCurrency === currency.code ? 'bg-accent' : ''
            }`}
          >
            <span className="mr-2">{currency.flag}</span>
            <span className="flex-1">{currency.name}</span>
            <span className="text-sm text-muted-foreground ml-2">
              {currency.symbol} {currency.code}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
