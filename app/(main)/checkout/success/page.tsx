import type { Metadata } from 'next';
import { CheckoutSuccess } from '@/components/Store/CheckoutSuccess';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Your payment has been processed successfully.',
  robots: 'noindex',
};

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  return (
    <main className="container mx-auto px-4 py-8">
      <CheckoutSuccess sessionId={session_id} />
    </main>
  );
}
