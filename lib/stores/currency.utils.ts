export const formatPrice = (amount: number, currency: string = 'USD'): string => {
  const price = amount / 100;
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(price);
};

export const formatPriceRange = (minAmount: number, maxAmount: number, currency: string = 'USD'): string => {
  if (minAmount === maxAmount) {
    return formatPrice(minAmount, currency);
  }
  return `${formatPrice(minAmount, currency)} - ${formatPrice(maxAmount, currency)}`;
};

export const getCurrencySymbol = (currency: string = 'USD'): string => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });

  // Format a small amount to extract just the symbol
  const formatted = numberFormat.format(0);
  return formatted.replace(/[\d\s.,]/g, '');
};

export const parsePriceFromCents = (cents: number): number => {
  return cents / 100;
};

export const convertPriceToCents = (price: number): number => {
  return Math.round(price * 100);
};
