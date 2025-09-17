import type { Metadata } from 'next';
import { getProducts } from '@/lib/stores';
import { StoreGrid } from '@/components/Store/StoreGrid';

export const metadata: Metadata = {
  title: 'Store',
  description: 'Browse our collection of products and find what you need.',
};

export default async function StorePage() {
  const products = await getProducts();
  // console.log(products);
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="main-heading mb-8 text-4xl font-bold">Store</h1>
      <div className="article-body">
        <StoreGrid products={products} />
      </div>
    </main>
  );
}

// Revalidate the page every hour to get fresh product data
export const revalidate = 3600;
