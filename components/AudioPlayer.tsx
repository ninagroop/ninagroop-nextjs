'use client';

import { useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import styles from './AudioPlayer.module.css';
import { AudioExcerpt } from '@/types/audio';
import { cn } from '@/lib/utils';

interface AudioPlayerComponentProps {
  excerpt: AudioExcerpt;
  autoPlay?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export default function AudioPlayerComponent({
  excerpt,
  autoPlay = false,
  className,
  onPlay,
  onPause,
  onEnded,
}: AudioPlayerComponentProps) {
  const playerRef = useRef<AudioPlayer>(null);

  if (!excerpt?.audiofile) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <p className="text-sm text-muted-foreground">Audio file not found</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Excerpt Title */}
      <div className="space-y-1">
        <h3 className="font-semibold">{excerpt.title}</h3>
        {excerpt.description && (
          <p className="text-sm text-muted-foreground">{excerpt.description}</p>
        )}
      </div>

      {/* Audio Player */}
      <AudioPlayer
        ref={playerRef}
        src={excerpt.audiofile}
        autoPlay={autoPlay}
        showJumpControls={true}
        showDownloadProgress={true}
        showFilledProgress={true}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        layout="horizontal-reverse"
        className={styles.audioPlayer}
      />
    </div>
  );
}
