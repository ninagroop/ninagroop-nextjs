import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '../../../lib/markdown';
import MarkdownRenderer from '../../../lib/markdown-renderer';
import ContactForm from './ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageBySlug('contact');

  return {
    title: `${pageData?.frontmatter.title || 'Contact'} - Nina Groop`,
    description:
      'Get in touch with Nina Groop for coaching inquiries, speaking engagements, or general questions.',
  };
}

export default async function ContactPage() {
  const pageData = await getPageBySlug('contact');

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
          className="article-body prose prose-lg mb-8 max-w-none"
          itemProp="articleBody"
        >
          <MarkdownRenderer content={pageData.htmlContent || ''} />
        </section>

        <ContactForm />
      </article>
    </main>
  );
}
