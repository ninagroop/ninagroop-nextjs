'use client';

import dynamic from 'next/dynamic';
import { AudioExcerpt } from '@/types/audio';

interface AudioPlayerComponentProps {
  excerpt: AudioExcerpt;
  autoPlay?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

// Loading component to show while the audio player loads
const AudioPlayerSkeleton = () => (
  <div className="w-full space-y-3">
    {/* Title Skeleton */}
    <div className="space-y-1">
      <div className="h-5 w-48 animate-pulse rounded bg-gray-300"></div>
      <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
    </div>

    {/* Audio Player Skeleton */}
    <div className="h-16 w-full animate-pulse rounded-lg border border-gray-200 bg-gray-100">
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          <div className="h-2 w-64 rounded bg-gray-300"></div>
          <div className="h-4 w-12 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  </div>
);

// Dynamically import the AudioPlayer component with no SSR
const AudioPlayerComponent = dynamic(() => import('./AudioPlayer'), {
  ssr: false,
  loading: () => <AudioPlayerSkeleton />,
});

export default function DynamicAudioPlayer(props: AudioPlayerComponentProps) {
  return <AudioPlayerComponent {...props} />;
}
