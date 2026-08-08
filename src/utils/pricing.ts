import { Product } from '../types';

export interface CalculatedPrice {
  unitPrice: number;
  originalUnitPrice: number;
  totalPrice: number;
  originalTotalPrice: number;
  discountPercent: number;
}

/**
 * Calculates dynamic price based on validity option, subscription type option, and quantity.
 */
export function calculateProductPrice(
  product: Product,
  selectedValidity?: string,
  selectedSubscription?: string,
  quantity: number = 1
): CalculatedPrice {
  const finalUnitPrice = Math.max(1, product.price);
  const finalOriginalUnitPrice = product.originalPrice && product.originalPrice > finalUnitPrice
    ? product.originalPrice
    : 0;

  const totalPrice = finalUnitPrice * quantity;
  const originalTotalPrice = finalOriginalUnitPrice * quantity;

  const discountPercent = finalOriginalUnitPrice > 0
    ? Math.round(((finalOriginalUnitPrice - finalUnitPrice) / finalOriginalUnitPrice) * 100)
    : 0;

  return {
    unitPrice: finalUnitPrice,
    originalUnitPrice: finalOriginalUnitPrice,
    totalPrice,
    originalTotalPrice,
    discountPercent,
  };
}
