import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Checkout Cancelled',
  description: 'Your checkout was cancelled.',
  robots: 'noindex',
};

export default function CheckoutCancelledPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Cancelled Icon */}
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Checkout Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Your checkout was cancelled. Don't worry, your items are still in your cart.
              </p>
              <p className="text-sm text-muted-foreground">
                You can continue shopping or try checking out again when you're ready.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/cart">
                  Return to Cart
                </Link>
              </Button>

              <Button variant="outline" asChild size="lg">
                <Link href="/store">
                  Continue Shopping
                </Link>
              </Button>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
              <p>
                Need help with checkout?{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>{' '}
                for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
