'use server';

import Stripe from 'stripe';
import type { StripeProduct } from './stripe.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

async function getStripeProducts() {
  const allProducts = [];
  let hasMore = true;
  let startingAfter = null;

  try {
    while (hasMore) {
      const response: any = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : undefined),
      });

      allProducts.push(...response.data);
      hasMore = response.has_more;
      startingAfter = response.data[response.data.length - 1].id;
    }

    return allProducts.filter(
      (product) => product.active && product.description
    );
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    throw error;
  }
}

async function getStripePrices() {
  const allPrices = [];
  let hasMore = true;
  let startingAfter = null;

  try {
    while (hasMore) {
      const response: any = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : undefined),
      });

      allPrices.push(...response.data);
      hasMore = response.has_more;
      startingAfter = response.data[response.data.length - 1].id;
    }

    return allPrices;
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    throw error;
  }
}

export async function getProducts(): Promise<StripeProduct[]> {
  try {
    const [products, prices] = await Promise.all([
      getStripeProducts(),
      getStripePrices(),
    ]);

    const productMap: Record<string, StripeProduct> = {};

    // Initialize products
    products.forEach((product) => {
      productMap[product.id] = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        images: product.images,
        metadata: product.metadata as StripeProduct['metadata'],
        prices: [],
      };
    });

    // Group prices by product (only non-recurring prices)
    prices.forEach((price) => {
      const productId =
        typeof price.product === 'string' ? price.product : price.product.id;
      if (productMap[productId]) {
        productMap[productId].prices.push({
          id: price.id,
          active: price.active,
          currency: price.currency,
          unit_amount: price.unit_amount || 0,
          nickname: price.nickname || undefined,
        });
      }
    });

    // Filter out products without prices and sort by unit_amount
    return Object.values(productMap)
      .filter((product) => product.prices.length > 0)
      .map((product) => ({
        ...product,
        prices: product.prices.sort((a, b) => a.unit_amount - b.unit_amount),
      }));
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return [];
  }
}

export async function getStripeProduct(
  productId: string
): Promise<StripeProduct | null> {
  try {
    const [product, prices] = await Promise.all([
      stripe.products.retrieve(productId),
      stripe.prices.list({
        product: productId,
        active: true,
      }),
    ]);

    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      images: product.images,
      metadata: product.metadata as StripeProduct['metadata'],
      prices: prices.data
        .map((price) => ({
          id: price.id,
          active: price.active,
          currency: price.currency,
          unit_amount: price.unit_amount || 0,
          nickname: price.nickname || undefined,
        }))
        .sort((a, b) => a.unit_amount - b.unit_amount),
    };
  } catch (error) {
    console.error(`Error fetching Stripe product ${productId}:`, error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<StripeProduct[]> {
  const products = await getProducts();
  return products.filter((product) => product.metadata.featured === 'true');
}
