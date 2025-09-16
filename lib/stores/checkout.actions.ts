'use server';

import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import type { CheckoutLineItem } from './stripe.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function createCheckoutSession(lineItems: CheckoutLineItem[]) {
  try {
    if (!lineItems.length) {
      throw new Error('No items in cart');
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancelled`,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    redirect(session.url);
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw redirect errors
    }

    throw new Error('Failed to create checkout session. Please try again.');
  }
}

export async function createSingleProductCheckout(
  priceId: string,
  quantity: number = 1
) {
  const lineItems: CheckoutLineItem[] = [{ price: priceId, quantity }];
  return createCheckoutSession(lineItems);
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });
    return session;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return null;
  }
}
