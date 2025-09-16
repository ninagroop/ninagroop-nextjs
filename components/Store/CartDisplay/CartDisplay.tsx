'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/stores/cart.store';
import { createCheckoutSession } from '@/lib/stores/checkout.actions';
import { formatPrice } from '@/lib/stores/currency.utils';
import type { StripePrice } from '@/lib/stores/stripe.types';

interface VariantRowsProps {
  variants: (StripePrice & { quantity: number })[];
  onRemove: (id: string) => void;
}

function VariantRows({ variants, onRemove }: VariantRowsProps) {
  return (
    <div className="ml-8 mt-2 space-y-2 border-l-2 border-muted pl-4">
      {variants.map((variant) => {
        if (variant.quantity <= 0) return null;

        return (
          <div key={variant.id} className="flex items-center justify-between py-2 text-sm">
            <div className="flex-1">
              <span className="text-muted-foreground">
                {variant.nickname || 'Default'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">{formatPrice(variant.unit_amount, variant.currency)}</span>
              <span className="text-center min-w-[2rem]">×{variant.quantity}</span>
              <span className="font-medium min-w-[4rem] text-right">
                {formatPrice(variant.unit_amount * variant.quantity, variant.currency)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(variant.id)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CartDisplay() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    cart,
    removeFromCart,
    getSubtotal,
    getCartItems,
  } = useCartStore();

  const subtotal = getSubtotal();
  const hasItems = subtotal > 0;

  const handleCheckout = () => {
    if (!hasItems) return;

    setError(null);
    startTransition(async () => {
      try {
        const lineItems = getCartItems();
        await createCheckoutSession(lineItems);
      } catch (error) {
        console.error('Checkout failed:', error);
        setError(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
      }
    });
  };

  if (!hasItems) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty, fill it up!</p>
          <Button asChild>
            <Link href="/store">
              Back to Store
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {cart.map((item) => {
              // Calculate item subtotal to determine if we should show it
              let itemSubtotal = 0;
              item.prices.forEach(price => {
                if (price.quantity > 0) {
                  itemSubtotal += price.quantity;
                }
              });

              if (itemSubtotal < 1) {
                return null;
              }

              const primaryImage = item.images[0];
              const hasMultiplePrices = item.prices.length > 1;
              const activePrices = item.prices.filter(p => p.quantity > 0);

              return (
                <div key={item.id} className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    {primaryImage && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          src={primaryImage}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}

                      {hasMultiplePrices ? (
                        <VariantRows variants={activePrices} onRemove={removeFromCart} />
                      ) : (
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">
                              {formatPrice(activePrices[0]?.unit_amount || 0, activePrices[0]?.currency)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Quantity: {itemSubtotal}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold">
                              {formatPrice(
                                itemSubtotal * (activePrices[0]?.unit_amount || 0),
                                activePrices[0]?.currency
                              )}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={isPending || !hasItems}
              className="w-full"
              size="lg"
            >
              {isPending ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
