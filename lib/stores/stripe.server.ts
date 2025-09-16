import Stripe from 'stripe';
import type { StripeProduct } from './stripe.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function getStripeProducts(): Promise<StripeProduct[]> {
  try {
    const [products, prices] = await Promise.all([
      stripe.products.list({
        active: true,
        expand: ['data.default_price'],
      }),
      stripe.prices.list({
        active: true,
        expand: ['data.product'],
      }),
    ]);

    const productMap: Record<string, StripeProduct> = {};

    // Initialize products
    products.data.forEach((product) => {
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
    prices.data.forEach((price) => {
      // Skip recurring prices since we don't support subscriptions
      if (price.recurring) return;

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

    if (!product.active) {
      return null;
    }

    // Filter out recurring prices
    const nonRecurringPrices = prices.data.filter((price) => !price.recurring);

    if (nonRecurringPrices.length === 0) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      images: product.images,
      metadata: product.metadata as StripeProduct['metadata'],
      prices: nonRecurringPrices
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
  const products = await getStripeProducts();
  return products.filter((product) => product.metadata.featured === 'true');
}
