import { getAudioExcerptsForPage } from '@/lib/audio';
import AudioPlayerList from './AudioPlayerList';
import { PageWithAudio } from '@/types/audio';

interface PageWithAudioProps {
  page: PageWithAudio & {
    title: string;
    body?: string;
    [key: string]: unknown;
  };
  className?: string;
}

export default async function PageWithAudioComponent({
  page,
  className,
}: PageWithAudioProps) {
  // Get audio excerpts if page has audio players configured
  const excerpts = page.audioplayers?.length
    ? await getAudioExcerptsForPage(
        page.audioplayers.map((config) => config.excerpt)
      )
    : [];

  return (
    <div className={className}>
      {/* Page Title */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
      </header>

      {/* Page Content */}
      <div className="space-y-8">
        {/* Body Content */}
        {page.body && (
          <div className="prose max-w-none">
            {/* You'll need to process markdown here - this is just a placeholder */}
            <div dangerouslySetInnerHTML={{ __html: page.body }} />
          </div>
        )}

        {/* Audio Players Section */}
        {excerpts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Listen to Excerpts</h2>
            <AudioPlayerList excerpts={excerpts} />
          </section>
        )}
      </div>
    </div>
  );
}
