import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStripeProduct } from '@/lib/stores';
import { ProductDetail } from '@/components/Store/ProductDetail';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  console.log(id);
  const product = await getStripeProduct(id);
  console.log(product);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const minPrice = Math.min(...product.prices.map((p) => p.unit_amount));
  const currency = product.prices[0]?.currency || 'USD';
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(minPrice / 100);

  return {
    title: product.name,
    description:
      product.description || `${product.name} - Starting at ${priceFormatted}`,
    openGraph: {
      title: product.name,
      description:
        product.description ||
        `${product.name} - Starting at ${priceFormatted}`,
      images:
        product.images.length > 0
          ? [
              {
                url: product.images[0],
                width: 600,
                height: 600,
                alt: product.name,
              },
            ]
          : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description:
        product.description ||
        `${product.name} - Starting at ${priceFormatted}`,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getStripeProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ProductDetail product={product} />
    </main>
  );
}

// Revalidate product pages every hour
export const revalidate = 3600;
