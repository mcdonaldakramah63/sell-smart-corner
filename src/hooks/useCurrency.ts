
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface CurrencyRate {
  id: string;
  base_currency: string;
  target_currency: string;
  exchange_rate: number;
  updated_at: string;
}

const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'GHS', name: 'Ghana Cedi', symbol: '₵', flag: '🇬🇭' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' }
];

export const useCurrency = () => {
  const [currentCurrency, setCurrentCurrency] = useState<string>('GHS');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('preferred-currency') || 'GHS';
    setCurrentCurrency(savedCurrency);
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*');

      if (error) throw error;

      const rates: Record<string, number> = {};
      data?.forEach(rate => {
        const key = `${rate.base_currency}_${rate.target_currency}`;
        rates[key] = rate.exchange_rate;
      });

      setExchangeRates(rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeCurrency = (currencyCode: string) => {
    setCurrentCurrency(currencyCode);
    localStorage.setItem('preferred-currency', currencyCode);
    
    toast({
      title: 'Currency changed',
      description: `Currency changed to ${SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)?.name}`,
    });
  };

  const convertPrice = (amount: number, fromCurrency: string = 'GHS', toCurrency: string = currentCurrency): number => {
    if (fromCurrency === toCurrency) return amount;

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const reverseRateKey = `${toCurrency}_${fromCurrency}`;
    
    if (exchangeRates[rateKey]) {
      return amount * exchangeRates[rateKey];
    } else if (exchangeRates[reverseRateKey]) {
      return amount / exchangeRates[reverseRateKey];
    }

    // Fallback: convert through GHS if direct rate not available
    if (fromCurrency !== 'GHS' && toCurrency !== 'GHS') {
      const toGHSRate = exchangeRates[`${fromCurrency}_GHS`] || (1 / exchangeRates[`GHS_${fromCurrency}`]);
      const fromGHSRate = exchangeRates[`GHS_${toCurrency`] || (1 / exchangeRates[`${toCurrency}_GHS`]);
      
      if (toGHSRate && fromGHSRate) {
        return amount * toGHSRate * fromGHSRate;
      }
    }

    return amount; // Return original if no conversion available
  };

  const formatPrice = (amount: number, currencyCode: string = currentCurrency): string => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    const convertedAmount = convertPrice(amount, 'GHS', currencyCode);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'GHS' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'GHS' ? 0 : 2
    }).format(convertedAmount);
  };

  return {
    currentCurrency,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    exchangeRates,
    changeCurrency,
    convertPrice,
    formatPrice,
    loading,
    refetchRates: fetchExchangeRates
  };
};
