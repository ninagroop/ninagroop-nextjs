import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '../../../lib/markdown';
import MarkdownRenderer from '../../../lib/markdown-renderer';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageBySlug('coaching');

  if (!pageData) {
    return {
      title: 'Coaching - Nina Groop',
    };
  }

  return {
    title: `${pageData.frontmatter.title} - Nina Groop`,
    description:
      "Discover Nina Groop's life coaching services designed to help you gain insight, find your power, and live with joy.",
  };
}

export default async function CoachingPage() {
  const pageData = await getPageBySlug('coaching');

  if (!pageData) {
    notFound();
  }

  return (
    <>
      <h1 className="main-heading text-text-bold mb-12 inline-block bg-white/80 px-[4vw] py-5 lg:max-w-[85vw] lg:px-5 lg:pl-[15vw] xl:max-w-[80vw] xl:pl-[20vw]">
        {pageData.frontmatter.title}
      </h1>

      <article
        className="article-body overflow-hidden bg-white/80 px-[4vw] py-[4vw] lg:w-full lg:px-[15vw] lg:py-12 xl:px-[20vw]"
        itemScope
        itemType="http://schema.org/Article"
      >
        <div itemProp="articleBody">
          <MarkdownRenderer
            content={pageData.htmlContent || ''}
            className="prose prose-lg prose-headings:font-normal prose-headings:text-text-bold prose-p:text-body-text prose-p:leading-relaxed prose-a:text-brand-orange prose-a:no-underline hover:prose-a:text-text-bold prose-a:border-b prose-a:border-dotted prose-a:border-text-light hover:prose-a:border-transparent prose-strong:text-text-bold prose-strong:font-semibold max-w-none"
            imagePath="/content/pages/coaching"
          />
        </div>
      </article>
    </>
  );
}
