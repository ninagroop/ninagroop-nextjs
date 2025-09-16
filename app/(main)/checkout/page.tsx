'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartDisplay } from '@/components/Store/CartDisplay';
import { useCartStore } from '@/lib/stores/cart.store';

type CheckoutState = 'idle' | 'success' | 'failure';

function CheckoutContent() {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('idle');
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkoutParam = searchParams.get('checkout');
    const sessionId = searchParams.get('session_id');

    if (checkoutParam === 'success' || sessionId) {
      setCheckoutState('success');
      clearCart();
    } else if (checkoutParam === 'failure') {
      setCheckoutState('failure');
    } else {
      setCheckoutState('idle');
    }
  }, [searchParams, clearCart]);

  const renderContent = () => {
    switch (checkoutState) {
      case 'success':
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl">Success!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                {`Thank you for your purchase. You'll be receiving your items in 4 business days.`}
              </p>
              <p className="text-sm">Forgot something?</p>
              <Button asChild size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        );

      case 'failure':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Payment Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Oops, something went wrong. Redirecting you to your cart to try
                again.
              </p>
              <Button onClick={() => setCheckoutState('idle')} size="lg">
                Try Again
              </Button>
            </CardContent>
          </Card>
        );

      case 'idle':
      default:
        return <CartDisplay />;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="main-heading mb-8 text-4xl font-bold">Your Cart</h1>
      <div className="article-body">{renderContent()}</div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto px-4 py-8">
          <h1 className="main-heading mb-8 text-4xl font-bold">Your Cart</h1>
          <div className="article-body">
            <div className="animate-pulse space-y-4">
              <div className="bg-muted h-32 rounded"></div>
              <div className="bg-muted h-8 w-1/3 rounded"></div>
            </div>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
