import React from 'react';
import Image from 'next/image';

interface BioProps {
  className?: string;
}

const Bio: React.FC<BioProps> = ({ className = '' }) => {
  return (
    <div className={`bio mb-8 flex items-start gap-4 rounded-lg bg-white/80 p-6 ${className}`}>
      <div className="bio-avatar relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
        <Image
          src="/content/home/nina-bio.jpg"
          alt="Nina Groop profile picture"
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="bio-content">
        <p className="text-sm leading-relaxed text-gray-700">
          Written by <strong className="font-semibold text-gray-900">Nina Groop</strong> — writer, editor, grant writer, and life coach.
          Nina helps people and organizations tell their stories with clarity and heart.
          {' '}
          <a
            href="http://instagram.com/ninagroopcoaching"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 transition-colors"
          >
            Follow her on Instagram
          </a>
        </p>
      </div>
    </div>
  );
};

export default Bio;
