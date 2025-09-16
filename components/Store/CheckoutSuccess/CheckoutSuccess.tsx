'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCartStore } from '@/lib/stores/cart.store';
import { formatPrice } from '@/lib/stores/currency.utils';

interface CheckoutSuccessProps {
  sessionId?: string;
}

interface OrderSummary {
  total: number;
  currency: string;
  customerEmail?: string;
  items: Array<{
    name: string;
    quantity: number;
    amount: number;
  }>;
}

export function CheckoutSuccess({ sessionId }: CheckoutSuccessProps) {
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart on successful checkout
    clearCart();

    // If we have a session ID, we could fetch order details
    // For now, we'll just show a success message
    if (sessionId) {
      // In a real implementation, you might want to fetch session details
      // from an API route that calls getCheckoutSession
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-muted border-t-primary rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-12 space-y-8">
      {/* Success Icon */}
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
        <svg
          className="h-10 w-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Success Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase. Your order has been processed successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {sessionId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Order confirmation: <code className="bg-background px-2 py-1 rounded font-mono">{sessionId}</code>
              </p>
            </div>
          )}

          {/* Order Summary (if available) */}
          {orderSummary && (
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderSummary.customerEmail && (
                  <p className="text-sm text-muted-foreground">
                    Confirmation email sent to: <strong>{orderSummary.customerEmail}</strong>
                  </p>
                )}

                <div className="space-y-2">
                  {orderSummary.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.amount, orderSummary.currency)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(orderSummary.total, orderSummary.currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground text-left">
                <li>• You'll receive a confirmation email shortly with your order details</li>
                <li>• If you ordered physical products, we'll send shipping updates to your email</li>
                <li>• For digital products, access will be granted immediately</li>
                <li>• Questions? Feel free to contact us</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/store">
                Continue Shopping
              </Link>
            </Button>

            <Button variant="outline" asChild size="lg">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 border-t text-sm text-muted-foreground">
            <p>
              Need help with your order?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
