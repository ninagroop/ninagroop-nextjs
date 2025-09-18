'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatPriceRange } from '@/lib/stores/currency.utils';
import type { StripeProduct } from '@/lib/stores/stripe.types';

interface StoreGridProps {
  products: StripeProduct[];
  className?: string;
}

function ProductCard({ product }: { product: StripeProduct }) {
  const minPrice = Math.min(...product.prices.map((p) => p.unit_amount));
  const maxPrice = Math.max(...product.prices.map((p) => p.unit_amount));
  const hasMultiplePrices = product.prices.length > 1;

  const primaryImage = product.images[0];
  const currency = product.prices[0]?.currency || 'USD';

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/store/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="bg-muted flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="group-hover:text-primary line-clamp-2 text-base transition-colors">
            {product.name}
          </CardTitle>

          {product.description && (
            <CardDescription className="line-clamp-2 text-sm">
              {product.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">
              {hasMultiplePrices ? (
                <span>{formatPriceRange(minPrice, maxPrice, currency)}</span>
              ) : (
                <span>{formatPrice(minPrice, currency)}</span>
              )}
            </div>

            {hasMultiplePrices && (
              <span className="text-muted-foreground text-xs">
                {product.prices.length} options
              </span>
            )}
          </div>

          {/* Product metadata badges */}
          <div className="flex flex-wrap gap-1">
            {product.metadata.featured === 'true' && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            {product.metadata.category && (
              <Badge variant="outline" className="text-xs">
                {product.metadata.category}
              </Badge>
            )}
            {product.metadata.color && (
              <Badge variant="outline" className="text-xs">
                {product.metadata.color}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export function StoreGrid({ products, className = '' }: StoreGridProps) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground mb-2 text-lg">
          No products available
        </div>
        <p className="text-muted-foreground text-sm">
          Check back later for new items.
        </p>
      </div>
    );
  }

  return (
    <section className={` ${className}`}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
