'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/stores/currency.utils';
import { AddToCart } from '@/components/Store/AddToCart';
import type { StripeProduct, StripePrice } from '@/lib/stores/stripe.types';

interface ProductDetailProps {
  product: StripeProduct;
}

function ProductImageGallery({ product }: { product: StripeProduct }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = product.images;

  if (!images.length) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-square relative overflow-hidden rounded-lg border">
        <Image
          src={images[selectedImageIndex]}
          alt={`${product.name} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnail images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <Button
              key={index}
              variant={selectedImageIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedImageIndex(index)}
              className="p-0 w-20 h-20 overflow-hidden flex-shrink-0"
            >
              <Image
                src={image}
                alt={`${product.name} - Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function PriceSelector({
  prices,
  selectedPriceId,
  onPriceSelect,
}: {
  prices: StripePrice[];
  selectedPriceId: string;
  onPriceSelect: (priceId: string) => void;
}) {
  if (prices.length === 1) {
    return (
      <div className="space-y-2">
        <div className="text-3xl font-bold">
          {formatPrice(prices[0].unit_amount, prices[0].currency)}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Option</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {prices.map((price) => (
          <label
            key={price.id}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPriceId === price.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="price"
                value={price.id}
                checked={selectedPriceId === price.id}
                onChange={() => onPriceSelect(price.id)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">
                  {price.nickname || `Option ${prices.indexOf(price) + 1}`}
                </div>
              </div>
            </div>
            <div className="font-bold">
              {formatPrice(price.unit_amount, price.currency)}
            </div>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

function QuantitySelector({
  quantity,
  onQuantityChange,
  disabled,
}: {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled: boolean;
}) {
  if (disabled) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quantity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            −
          </Button>
          <span className="text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedPriceId, setSelectedPriceId] = useState(product.prices[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  const hideQuantity = product.metadata.hidequantity === 'true';
  const selectedPrice = product.prices.find(p => p.id === selectedPriceId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/store" className="hover:text-primary transition-colors">
          Store
        </Link>
        <span>›</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <ProductImageGallery product={product} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            {product.description && (
              <CardDescription className="text-base leading-relaxed">
                {product.description}
              </CardDescription>
            )}
          </div>

          {/* Metadata badges */}
          {(product.metadata.category || product.metadata.featured === 'true' || product.metadata.color) && (
            <div className="flex flex-wrap gap-2">
              {product.metadata.featured === 'true' && (
                <Badge variant="secondary">
                  ⭐ Featured
                </Badge>
              )}
              {product.metadata.category && (
                <Badge variant="outline">
                  {product.metadata.category}
                </Badge>
              )}
              {product.metadata.color && (
                <Badge variant="outline">
                  {product.metadata.color}
                </Badge>
              )}
              {product.metadata.gender && (
                <Badge variant="outline">
                  {product.metadata.gender}
                </Badge>
              )}
            </div>
          )}

          {/* Price Selection */}
          <PriceSelector
            prices={product.prices}
            selectedPriceId={selectedPriceId}
            onPriceSelect={setSelectedPriceId}
          />

          {/* Quantity Selection */}
          {!hideQuantity && (
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              disabled={hideQuantity}
            />
          )}

          {/* Add to Cart */}
          <Card>
            <CardContent className="pt-6">
              <AddToCart
                product={product}
                selectedId={selectedPriceId}
                quantity={quantity}
                className="w-full"
                disabled={!selectedPrice}
              />
            </CardContent>
          </Card>

          {/* Additional Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>• Free shipping on all orders</div>
              <div>• Secure checkout with Stripe</div>
              <div>• Questions? <Link href="/contact" className="text-primary hover:underline">Contact us</Link></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
