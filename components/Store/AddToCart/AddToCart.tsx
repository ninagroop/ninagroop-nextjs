'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/stores/cart.store';
import type { StripeProduct } from '@/lib/stores/stripe.types';

interface AddToCartProps {
  product: StripeProduct;
  selectedId: string;
  quantity?: number;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function AddToCart({
  product,
  selectedId,
  quantity = 1,
  onClick,
  className = '',
  disabled = false,
}: AddToCartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCartStore();

  const selectedPrice = product.prices.find(price => price.id === selectedId);

  const handleAddToCart = async () => {
    if (!selectedPrice) {
      console.error('No price selected');
      return;
    }

    setIsLoading(true);

    try {
      // Add to cart
      addToCart(product, selectedId, quantity);

      // Call optional onClick callback
      if (onClick) {
        onClick();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled || isLoading || !selectedPrice}
      className={className}
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
