'use client';

import AudioPlayerComponent from './AudioPlayer';
import { AudioExcerpt } from '@/types/audio';

interface InlineAudioPlayerProps {
  excerpt: AudioExcerpt | null;
  title?: string;
  slug?: string;
  className?: string;
}

export default function InlineAudioPlayer({
  excerpt,
  title,
  slug,
  className = '',
}: InlineAudioPlayerProps) {
  if (!excerpt) {
    return (
      <div className={`my-6 ${className}`}>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <div className="mb-2 text-sm font-medium text-red-800">
            Audio Player Error
          </div>
          <div className="text-sm text-red-600">
            Audio excerpt not found
            {slug && (
              <div className="mt-1 text-xs text-red-500">Slug: {slug}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 ${className}`}>
      <div className="rounded-lg border border-gray-200 bg-white/80 p-4 shadow-sm">
        {title && (
          <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
        )}
        <AudioPlayerComponent excerpt={excerpt} />
      </div>
    </div>
  );
}
