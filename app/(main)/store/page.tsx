import type { Metadata } from 'next';
import { getStripeProducts } from '@/lib/stores';
import { StoreGrid } from '@/components/Store/StoreGrid';

export const metadata: Metadata = {
  title: 'Store',
  description: 'Browse our collection of products and find what you need.',
};

export default async function StorePage() {
  const products = await getStripeProducts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="main-heading text-4xl font-bold mb-8">Store</h1>
      <div className="article-body">
        <StoreGrid products={products} />
      </div>
    </main>
  );
}

// Revalidate the page every hour to get fresh product data
export const revalidate = 3600;
