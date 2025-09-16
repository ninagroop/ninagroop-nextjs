export interface StripePrice {
  id: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  nickname?: string;
  quantity?: number;
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  metadata: {
    featured?: string;
    hidequantity?: string;
    category?: string;
    gender?: string;
    color?: string;
  };
  prices: StripePrice[];
}

export interface CartItem extends StripeProduct {
  prices: (StripePrice & { quantity: number })[];
}

export interface CheckoutLineItem {
  price: string;
  quantity: number;
}
