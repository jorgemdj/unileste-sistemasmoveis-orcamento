// src/utils/currency.ts

/** Formats an integer amount in cents as BRL currency string */
export const formatCurrency = (cents: number): string => {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/** Parses a localized BRL string (e.g. "1.234,56") back to cents */
export const parseCurrencyToCents = (value: string): number => {
  const normalised = value.replace(/\./g, '').replace(',', '.');
  const float = parseFloat(normalised);
  if (isNaN(float)) return 0;
  return Math.round(float * 100);
};

/** Calculates total of a list of service items in cents */
export const calcSubtotal = (items: { unitPrice: number; quantity: number }[]): number =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

/** Applies a percentage discount to a centavos amount */
export const applyDiscount = (subtotal: number, discountPct: number): number =>
  Math.round(subtotal * (1 - discountPct / 100));
