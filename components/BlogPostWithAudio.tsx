import { getAudioExcerptBySlug } from '@/lib/audio';
import DynamicAudioPlayer from './DynamicAudioPlayer';
import { BlogPostWithAudio } from '@/types/audio';
import Image from 'next/image';

interface BlogPostWithAudioProps {
  post: BlogPostWithAudio & {
    title: string;
    date: string;
    description?: string;
    body: string;
    featuredimage?: string;
    [key: string]: unknown;
  };
  className?: string;
}

export default async function BlogPostWithAudioComponent({
  post,
  className,
}: BlogPostWithAudioProps) {
  // Get audio excerpt if post has one configured
  const audioExcerpt = post.audioexcerpt
    ? await getAudioExcerptBySlug(post.audioexcerpt)
    : null;

  return (
    <article className={className}>
      {/* Blog Post Header */}
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

        <div className="text-muted-foreground flex items-center space-x-4 text-sm">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>

        {post.description && (
          <p className="text-muted-foreground text-lg">{post.description}</p>
        )}
      </header>

      {/* Featured Image */}
      {post.featuredimage && (
        <div className="mb-8">
          <Image
            src={post.featuredimage}
            alt={post.title}
            width={800}
            height={400}
            className="w-full rounded-lg object-cover"
          />
        </div>
      )}

      {/* Audio Excerpt */}
      {audioExcerpt && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Listen to this excerpt</h2>
          <div className="rounded-lg border p-4">
            <DynamicAudioPlayer excerpt={audioExcerpt} />
          </div>
        </section>
      )}

      {/* Blog Post Content */}
      <div className="prose max-w-none">
        {/* You'll need to process markdown here - this is just a placeholder */}
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </article>
  );
}
