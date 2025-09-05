import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { AudioExcerpt } from '@/types/audio';

const audioExcerptsDirectory = path.join(
  process.cwd(),
  'content/audio-excerpts'
);

export function getAllAudioExcerpts(): AudioExcerpt[] {
  try {
    // Ensure directory exists
    if (!fs.existsSync(audioExcerptsDirectory)) {
      fs.mkdirSync(audioExcerptsDirectory, { recursive: true });
      return [];
    }

    const fileNames = fs.readdirSync(audioExcerptsDirectory);
    const allExcerptsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(audioExcerptsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          ...data,
        } as AudioExcerpt;
      })
      .filter((excerpt) => excerpt.published !== false);

    return allExcerptsData.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error loading audio excerpts:', error);
    return [];
  }
}

export function getAudioExcerptBySlug(slug: string): AudioExcerpt | null {
  try {
    const fullPath = path.join(audioExcerptsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      ...data,
    } as AudioExcerpt;
  } catch (error) {
    console.error(`Error loading audio excerpt ${slug}:`, error);
    return null;
  }
}

export async function getAudioExcerptsForPage(
  excerptSlugs: string[]
): Promise<AudioExcerpt[]> {
  const excerpts = excerptSlugs
    .map((slug) => getAudioExcerptBySlug(slug))
    .filter((excerpt): excerpt is AudioExcerpt => excerpt !== null);

  return excerpts;
}

export function extractAudioPlayerSlugsFromMarkdown(content: string): string[] {
  const slugs: string[] = [];

  // Match all audio-player tags and extract slug attributes
  const audioPlayerRegex =
    /<audio-player[^>]*slug="([^"]*)"[^>]*><\/audio-player>/gi;
  let match;

  while ((match = audioPlayerRegex.exec(content)) !== null) {
    const slug = match[1];
    if (slug && !slugs.includes(slug)) {
      slugs.push(slug);
    }
  }

  return slugs;
}

export async function getAudioExcerptsForMarkdown(
  content: string
): Promise<{ [slug: string]: AudioExcerpt }> {
  const slugs = extractAudioPlayerSlugsFromMarkdown(content);
  const excerpts: { [slug: string]: AudioExcerpt } = {};

  for (const slug of slugs) {
    const excerpt = getAudioExcerptBySlug(slug);
    if (excerpt) {
      excerpts[slug] = excerpt;
    }
  }

  return excerpts;
}

export function createAudioDirectories(): void {
  try {
    // Create content directory for audio excerpts
    if (!fs.existsSync(audioExcerptsDirectory)) {
      fs.mkdirSync(audioExcerptsDirectory, { recursive: true });
    }

    // Create public directory for audio files
    const audioFilesDirectory = path.join(
      process.cwd(),
      'public/content/audio'
    );
    if (!fs.existsSync(audioFilesDirectory)) {
      fs.mkdirSync(audioFilesDirectory, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating audio directories:', error);
  }
}
