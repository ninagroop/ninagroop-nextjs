'use client';

import DynamicAudioPlayer from './DynamicAudioPlayer';
import { AudioExcerpt, AudioPlayerConfig } from '@/types/audio';
import { cn } from '@/lib/utils';

interface AudioPlayerListProps {
  excerpts: AudioExcerpt[];
  playerConfigs?: AudioPlayerConfig[];
  className?: string;
}

export default function AudioPlayerList({
  excerpts,
  playerConfigs = [],
  className,
}: AudioPlayerListProps) {
  if (!excerpts.length) {
    return (
      <div className="border-muted rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No audio excerpts available</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {excerpts.map((excerpt) => (
        <div key={excerpt.slug} className="rounded-lg border p-4">
          <DynamicAudioPlayer excerpt={excerpt} autoPlay={false} />
        </div>
      ))}
    </div>
  );
}
