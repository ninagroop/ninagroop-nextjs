import React from 'react';
import Header from '@/components/Header';
import Footer, { getFooterData } from '@/components/Footer';
import BackgroundImage from '@/components/BackgroundImage';
import { navigationItems, siteMetadata } from '@/lib/navigation';
import { getHomeContent } from '@/lib/markdown';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooterData();
  const homeContent = await getHomeContent();

  // Default to shifaaz-shamoon if no featured image is specified
  const backgroundImageSrc = homeContent?.frontmatter?.featuredimage
    ? `/content/home/${homeContent.frontmatter.featuredimage}`
    : '/content/home/shifaaz-shamoon-okvxy9tg3ky-unsplash.jpg';

  return (
    <BackgroundImage imageSrc={backgroundImageSrc}>
      <div id="page-wrapper">
        <Header
          siteTitle={siteMetadata.title}
          siteDescription={siteMetadata.description}
          nav={navigationItems}
        />
        <main className="min-h-screen">{children}</main>
      </div>
      {footerData && <Footer {...footerData} />}
    </BackgroundImage>
  );
}
