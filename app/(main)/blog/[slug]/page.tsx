import { getPostBySlug, getAdjacentPosts, getPostPaths } from '@/lib/markdown';
import MarkdownRenderer from '@/lib/markdown-renderer';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const paths = getPostPaths();

  return paths.map((path) => ({
    slug: path,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(`/blog/${slug}`);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { frontmatter, imageBasePath } = post;

  return {
    title: `${frontmatter.title} - Nina Groop`,
    description: frontmatter.description || post.excerpt,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description || post.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: ['Nina Groop'],
      ...(frontmatter.featuredimage && {
        images: [
          {
            url: `/content/blog/${imageBasePath}/${frontmatter.featuredimage}`,
            alt: frontmatter.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description || post.excerpt,
      ...(frontmatter.featuredimage && {
        images: [`/content/blog/${imageBasePath}/${frontmatter.featuredimage}`],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(`/blog/${slug}`);

  if (!post) {
    notFound();
  }

  const {
    frontmatter,
    htmlContent,
    formattedDate,
    readingTime,
    imageBasePath,
  } = post;

  const adjacentPosts = await getAdjacentPosts(post.slug);

  return (
    <>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        {/* Featured Image */}
        {frontmatter.featuredimage && (
          <div className="featured-image-container relative mb-8 h-64 w-full overflow-hidden md:h-80 lg:h-96">
            <Image
              src={`/content/blog/${imageBasePath}/${frontmatter.featuredimage}`}
              alt={frontmatter.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <h1
            className="main-heading mb-4 inline-block bg-white/80 px-[4vw] py-5 text-black lg:max-w-[85vw] lg:px-5 lg:pl-[15vw] xl:max-w-[80vw] xl:pl-[20vw]"
            itemProp="headline"
          >
            {frontmatter.title}
          </h1>

          {/* Article Meta */}
          <div className="article-meta bg-white/60 px-[4vw] py-2 text-sm text-gray-600 lg:px-[15vw] xl:px-[20vw]">
            <time
              dateTime={frontmatter.date}
              itemProp="datePublished"
              className="mr-4"
            >
              {formattedDate}
            </time>
            {readingTime && (
              <span className="reading-time">{readingTime} min read</span>
            )}
          </div>
        </header>

        {/* Article Body */}
        <section
          className="article-body overflow-hidden bg-white/80 px-[4vw] py-[4vw] lg:w-full lg:px-[15vw] lg:py-12 xl:px-[20vw]"
          itemProp="articleBody"
        >
          <MarkdownRenderer
            content={htmlContent || ''}
            className="prose prose-lg prose-headings:font-normal prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-700 prose-a:border-b prose-a:border-dotted prose-a:border-orange-300 hover:prose-a:border-transparent prose-strong:text-gray-900 prose-strong:font-semibold max-w-none"
          />

          <hr className="my-12 border-0 border-b-2 border-gray-200" />

          {/* Post Navigation */}
          <nav className="blog-post-nav" aria-label="Blog post navigation">
            <ul className="flex list-none flex-wrap justify-between gap-4 p-0">
              <li className="min-w-0 flex-1">
                {adjacentPosts.previous && (
                  <Link
                    href={adjacentPosts.previous.slug}
                    rel="prev"
                    className="group inline-flex items-center text-orange-600 transition-colors hover:text-orange-700"
                  >
                    <span className="mr-2" aria-hidden="true">
                      ←
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs tracking-wide text-gray-500 uppercase">
                        Previous
                      </div>
                      <div className="truncate font-medium group-hover:text-orange-700">
                        {adjacentPosts.previous.frontmatter.title}
                      </div>
                    </div>
                  </Link>
                )}
              </li>
              <li className="min-w-0 flex-1 text-right">
                {adjacentPosts.next && (
                  <Link
                    href={adjacentPosts.next.slug}
                    rel="next"
                    className="group inline-flex items-center justify-end text-orange-600 transition-colors hover:text-orange-700"
                  >
                    <div className="min-w-0 text-right">
                      <div className="text-xs tracking-wide text-gray-500 uppercase">
                        Next
                      </div>
                      <div className="truncate font-medium group-hover:text-orange-700">
                        {adjacentPosts.next.frontmatter.title}
                      </div>
                    </div>
                    <span className="ml-2" aria-hidden="true">
                      →
                    </span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>

          {/* Back to Blog */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center font-medium text-orange-600 transition-colors hover:text-orange-700"
            >
              <span className="mr-2" aria-hidden="true">
                ←
              </span>
              Back to Blog
            </Link>
          </div>
        </section>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: frontmatter.title,
              datePublished: frontmatter.date,
              dateModified: frontmatter.date,
              author: {
                '@type': 'Person',
                name: 'Nina Groop',
                url: 'https://ninagroop.com',
              },
              publisher: {
                '@type': 'Person',
                name: 'Nina Groop',
                url: 'https://ninagroop.com',
              },
              description: frontmatter.description || post.excerpt,
              ...(frontmatter.featuredimage && {
                image: `/content/blog/${imageBasePath}/${frontmatter.featuredimage}`,
              }),
            }),
          }}
        />
      </article>
    </>
  );
}
