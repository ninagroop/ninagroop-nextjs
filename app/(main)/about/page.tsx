import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '../../../lib/markdown';
import MarkdownRenderer from '../../../lib/markdown-renderer';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageBySlug('about');

  if (!pageData) {
    return {
      title: 'About - Nina Groop',
    };
  }

  return {
    title: `${pageData.frontmatter.title} - Nina Groop`,
    description:
      'Learn about Nina Groop, life coach, writer, and speaker dedicated to helping others find their power and live with joy.',
  };
}

export default async function AboutPage() {
  const pageData = await getPageBySlug('about');

  if (!pageData) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <article
        className="page mx-auto max-w-4xl"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header className="mb-8">
          <h1
            className="main-heading mb-4 text-4xl font-light"
            itemProp="headline"
          >
            {pageData.frontmatter.title}
          </h1>
        </header>
        <section
          className="article-body prose prose-lg max-w-none"
          itemProp="articleBody"
        >
          <MarkdownRenderer
            content={pageData.htmlContent || ''}
            imagePath="/content/pages/about"
          />
        </section>
      </article>
    </main>
  );
}
