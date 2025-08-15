import React from 'react';
import Header from '@/components/Header';
import Footer, { getFooterData } from '@/components/Footer';
import { navigationItems, siteMetadata } from '@/lib/navigation';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooterData();

  return (
    <>
      <Header
        siteTitle={siteMetadata.title}
        siteDescription={siteMetadata.description}
        nav={navigationItems}
      />
      <main className="min-h-screen">{children}</main>
      {footerData && <Footer {...footerData} />}
    </>
  );
}
