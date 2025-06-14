/**
 * Currency codes supported by the application and payment providers
 */
export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  TON = 'TON',
  USDT = 'USDT',
}

/**
 * Currency symbols for display purposes
 */
export const CurrencySymbols: Record<Currency, string> = {
  [Currency.RUB]: '₽',
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.TON]: '💎',
  [Currency.USDT]: '💲',
};

/**
 * Default currency used throughout the application
 */
export const DEFAULT_CURRENCY = Currency.RUB;

/**
 * Format a price with the appropriate currency symbol
 */
export const formatPrice = (
  price: number,
  currency: Currency = DEFAULT_CURRENCY,
): string => {
  return `${price} ${CurrencySymbols[currency]}`;
};
