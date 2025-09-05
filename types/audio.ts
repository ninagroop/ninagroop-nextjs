export interface AudioExcerpt {
  slug: string;
  title: string;
  audiofile: string;
  description?: string;
  published: boolean;
  templatekey: 'audio-excerpt';
}

export interface AudioPlayerConfig {
  excerpt: string; // Excerpt slug
}

export interface PageWithAudio {
  audioplayers?: AudioPlayerConfig[];
}

export interface BlogPostWithAudio {
  audioexcerpt?: string; // Excerpt slug
}

export interface HomePageWithAudio {
  featuredaudio?: string; // Excerpt slug
}
