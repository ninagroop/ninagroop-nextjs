import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPages } from '../../../lib/markdown';
import MarkdownRenderer from '../../../lib/markdown-renderer';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const allPages = await getAllPages();

    return allPages.map((page) => {
      const slug = page.slug.replace(/^\//, '');
      const segments = slug.split('/').filter(Boolean);
      return { slug: segments };
    });
  } catch (error) {
    console.error('Error generating static params for pages:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  const pageData = await getPageBySlug(slug);

  if (!pageData) {
    return {
      title: 'Page Not Found - Nina Groop',
    };
  }

  return {
    title: `${pageData.frontmatter.title} - Nina Groop`,
    description:
      pageData.content.slice(0, 160) ||
      `${pageData.frontmatter.title} - Nina Groop`,
  };
}

export default async function DynamicPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  const pageData = await getPageBySlug(slug);

  if (!pageData) {
    notFound();
  }

  // Determine image path for this page
  const imagePath = `/content/pages/${slug}`;

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
            imagePath={imagePath}
          />
        </div>
      </article>
    </>
  );
}
