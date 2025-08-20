'use client';

import { BackgroundImageProps } from './BackgroundImage.types';

export default function BackgroundImage({
  imageSrc,
  children,
}: BackgroundImageProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Fixed background image with gradient overlay */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.35) 60%, rgba(255, 255, 255, 0.35) 100%), url('${imageSrc}')`,
        }}
      />
      {children}
    </div>
  );
}
