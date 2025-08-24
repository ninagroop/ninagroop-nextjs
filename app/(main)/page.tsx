import { getHomeContent, getAllPosts } from '@/lib/markdown';
import MarkdownRenderer from '@/lib/markdown-renderer';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Home - Nina Groop',
  description:
    'Nina Groop — writer, editor, grant writer, and life coach — helping people and organizations tell their stories.',
};

export default async function HomePage() {
  const homeContent = await getHomeContent();
  const posts = await getAllPosts();

  if (!homeContent) {
    notFound();
  }

  const { frontmatter, htmlContent } = homeContent;

  return (
    <>
      {/* Tagline Section */}
      <section className="flex w-full justify-center">
        <h2 className="text-text-bold min-w-[80vw] bg-transparent py-5 text-center text-3xl font-bold uppercase">
          {frontmatter.tagline}
        </h2>
      </section>

      {/* Spacing */}
      <div className="h-16" />

      {/* Home Quote Section */}
      <section className="main-heading text-text-bold mb-12 inline-block bg-white/80 px-[4vw] py-5 lg:max-w-[85vw] lg:px-5 lg:pl-[15vw] xl:max-w-[80vw] xl:pl-[20vw]">
        <h4 className="text-body-text pt-5 text-base leading-relaxed font-normal lg:text-base">
          {frontmatter.homequote}
        </h4>
      </section>

      {/* Main Content */}
      <article className="article-body overflow-hidden bg-white/80 px-[4vw] py-[4vw] lg:w-full lg:px-[15vw] lg:py-12 xl:px-[20vw]">
        <div itemProp="description">
          <MarkdownRenderer
            content={htmlContent}
            className="text-body-text max-w-none"
            posts={posts}
            imagePath="/content/home"
          />
        </div>
      </article>
    </>
  );
}
