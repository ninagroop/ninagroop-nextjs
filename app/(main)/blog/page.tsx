import { getAllPosts } from '@/lib/markdown';
import Bio from '@/components/Bio';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Nina Groop',
  description:
    'Articles about life coaching, personal development, writing, and inspiration by Nina Groop.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  if (posts.length === 0) {
    return (
      <>
        <Bio />
        <h1 className="main-heading text-text-bold mb-12 inline-block bg-white/80 px-[4vw] py-5 lg:max-w-[85vw] lg:px-5 lg:pl-[15vw] xl:max-w-[80vw] xl:pl-[20vw]">
          Blog
        </h1>
        <div className="article-body overflow-hidden bg-white/80 px-[4vw] py-[4vw] lg:w-full lg:px-[15vw] lg:py-12 xl:px-[20vw]">
          <p>No blog posts found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Bio />
      <h1 className="main-heading text-text-bold mb-12 inline-block bg-white/80 px-[4vw] py-5 lg:max-w-[85vw] lg:px-5 lg:pl-[15vw] xl:max-w-[80vw] xl:pl-[20vw]">
        Blog
      </h1>

      <div className="article-body overflow-hidden bg-white/80 px-[4vw] py-[4vw] lg:w-full lg:px-[15vw] lg:py-12 xl:px-[20vw]">
        <div>
          <ol className="grid list-none gap-5 p-0 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const title = post.frontmatter.title;
              const hasImage = post.frontmatter.featuredimage;

              if (!hasImage) return null;

              return (
                <li
                  key={post.slug}
                  className="relative p-0 transition-opacity hover:opacity-70"
                >
                  <Link
                    href={post.slug}
                    className="block border-none no-underline"
                    itemProp="url"
                  >
                    <article
                      className="relative"
                      itemScope
                      itemType="http://schema.org/Article"
                    >
                      <div className="relative">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={`/content/blog/${post.imageBasePath}/${post.frontmatter.featuredimage}`}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/55 via-white/85 to-white/90 p-2.5">
                          <header>
                            <h4 className="m-0 text-base">
                              <span
                                itemProp="headline"
                                className="text-text-bold tracking-normal no-underline"
                              >
                                {title}
                              </span>
                            </h4>
                          </header>
                          <section className="block h-px overflow-hidden">
                            <p
                              className="text-body-text text-sm"
                              dangerouslySetInnerHTML={{
                                __html:
                                  post.frontmatter.description ||
                                  post.excerpt ||
                                  '',
                              }}
                              itemProp="description"
                            />
                          </section>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
